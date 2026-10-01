/**
 * Данные страницы фильма из TMDB.
 *
 * На сайте id фильма — кинопоисковский (он же в маршруте /film/{id} и в плеерах),
 * а TMDB такого id не знает. Поэтому сначала бесплатно восстанавливаем связку
 * через Wikidata: P2603 (Kinopoisk film ID) -> P4947 (TMDb movie ID) /
 * P4983 (TMDb TV series ID). Обратная связка (TMDB id -> kinopoisk id) нужна для
 * карточек «Похожие» и «Сиквелы и приквелы», и делается тем же способом одним
 * батч-запросом. Всё кэшируется в .cache/kp-tmdb.json.
 */

import fs from "node:fs";
import path from "node:path";
import { tmdbGet, posterUrl } from "./tmdb.js";

const CACHE_FILE = path.join(process.cwd(), ".cache", "kp-tmdb.json");
let store = null;
let countriesMap = null;

function loadStore() {
  if (store) return store;
  try {
    store = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    store = { toTmdb: {}, toKp: {} };
  }
  if (!store.toTmdb) store.toTmdb = {};
  if (!store.toKp) store.toKp = {};
  return store;
}

function saveStore() {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(store));
  } catch (error) {
    console.warn("[filmPage] кэш не сохранён:", error?.message);
  }
}

async function sparql(query) {
  try {
    const response = await fetch(
      `https://query.wikidata.org/sparql?${new URLSearchParams({ query, format: "json" }).toString()}`,
      {
        headers: {
          accept: "application/sparql-results+json",
          "User-Agent": "filmhub-film-page/1.0 (+https://filmhub.lol)",
        },
        cache: "no-store",
      }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.results?.bindings || [];
  } catch (error) {
    console.warn("[filmPage] Wikidata недоступна:", error?.message);
    return [];
  }
}

/** kinopoisk_id -> { tmdbId, media } */
export async function resolveTmdbByKinopoisk(kinopoiskId) {
  const key = String(kinopoiskId ?? "").trim();
  if (!key) return null;

  const data = loadStore();
  if (data.toTmdb[key] !== undefined) return data.toTmdb[key];

  const rows = await sparql(
    `SELECT ?f ?m ?tv WHERE { ?f wdt:P2603 "${key}". OPTIONAL { ?f wdt:P4947 ?m } OPTIONAL { ?f wdt:P4983 ?tv } }`
  );

  const row = rows[0];
  const movieId = row?.m?.value;
  const tvId = row?.tv?.value;
  const result =
    movieId || tvId
      ? {
          tmdbId: Number(movieId || tvId),
          media: movieId ? "movie" : "tv",
          wikidata: row.f.value.split("/").pop(),
        }
      : null;

  data.toTmdb[key] = result;
  saveStore();
  return result;
}

/** Список TMDB id -> kinopoisk_id (для «Похожих» и «Сиквелов») */
export async function resolveKinopoiskByTmdbIds(ids, media) {
  const wanted = [...new Set((ids || []).filter(Boolean).map(String))];
  if (!wanted.length) return new Map();

  const data = loadStore();
  const result = new Map();
  const missing = [];

  wanted.forEach((id) => {
    const cached = data.toKp[id];
    if (cached !== undefined) {
      if (cached) result.set(Number(id), cached);
    } else {
      missing.push(id);
    }
  });

  if (missing.length) {
    const property = media === "tv" ? "P4983" : "P4947";
    const rows = await sparql(
      `SELECT ?t ?kp WHERE { VALUES ?t { ${missing.map((id) => `"${id}"`).join(" ")} } ?f wdt:${property} ?t. ?f wdt:P2603 ?kp. }`
    );

    const found = new Map();
    rows.forEach((row) => {
      found.set(row.t.value, Number(row.kp.value));
    });

    missing.forEach((id) => {
      const kp = found.get(id) ?? null;
      data.toKp[id] = kp;
      if (kp) result.set(Number(id), kp);
    });
    saveStore();
  }

  return result;
}

/** Локализованные названия стран (TMDB отдаёт их по-русски при language=ru-RU) */
async function getCountries() {
  if (countriesMap) return countriesMap;
  const data = await tmdbGet("/configuration/countries");
  const map = new Map();
  (Array.isArray(data) ? data : []).forEach((country) => {
    map.set(country.iso_3166_1, country.native_name || country.english_name);
  });
  countriesMap = map;
  return map;
}

const CARTOON_GENRES = ["мультфильм", "анимац", "animation"];

function isCartoon(genres) {
  return (genres || []).some((genre) =>
    CARTOON_GENRES.some((marker) => String(genre).toLowerCase().includes(marker))
  );
}

function toCard(item, kinopoiskId) {
  const poster = posterUrl(item.poster_path, "w500");
  return {
    id: kinopoiskId,
    name: item.title || item.name || "",
    alternativeName: item.original_title || item.original_name || "",
    enName: item.original_title || item.original_name || null,
    year: Number(String(item.release_date || item.first_air_date || "").slice(0, 4)) || null,
    type: item.__media === "tv" ? "tv-series" : "movie",
    description: "",
    shortDescription: null,
    movieLength: null,
    rating: { kp: item.vote_average || 0, imdb: 0, filmCritics: 0, russianFilmCritics: 0, await: 0 },
    votes: { kp: item.vote_count || 0, imdb: 0, filmCritics: 0, russianFilmCritics: 0, await: 0 },
    poster: { url: poster, previewUrl: poster },
    logo: { url: null },
    externalId: { imdb: null },
    names: [],
  };
}

async function buildRelated(items, media) {
  const list = (items || []).slice(0, 20);
  const map = await resolveKinopoiskByTmdbIds(list.map((item) => item.id), media);

  return list
    .filter((item) => map.has(item.id))
    .map((item) => toCard({ ...item, __media: media }, map.get(item.id)));
}

/**
 * Полная карточка фильма в формате, который ждёт фронтенд Filmhub
 * (тот же FilmInfoType, что отдавал apiget).
 */
export async function getFilmPageData(kinopoiskId) {
  const resolved = await resolveTmdbByKinopoisk(kinopoiskId);
  if (!resolved?.tmdbId) return null;

  const media = resolved.media;
  const data = await tmdbGet(`/${media}/${resolved.tmdbId}`, {
    append_to_response:
      "credits,videos,images,recommendations,similar,keywords,external_ids",
  });

  if (!data || data.__error__ || (!data.title && !data.name)) return null;

  const countries = await getCountries();
  const genres = (data.genres || []).map((genre) => genre.name);
  const cartoon = isCartoon(genres);
  const trailer =
    (data.videos?.results || []).find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    ) || (data.videos?.results || [])[0];

  const backdrop = posterUrl(data.backdrop_path, "w1280");
  const posterBig = posterUrl(data.poster_path, "original");
  const posterSmall = posterUrl(data.poster_path, "w500");

  const collection = data.belongs_to_collection;
  let sequels = [];
  if (collection?.id) {
    const parts = await tmdbGet(`/collection/${collection.id}`);
    sequels = await buildRelated(
      (parts.parts || []).filter((part) => part.id !== data.id),
      media
    );
  }

  const similar = await buildRelated(
    [...(data.recommendations?.results || []), ...(data.similar?.results || [])],
    media
  );

  // убираем дубли между «похожими» и «сиквелами»
  const sequelIds = new Set(sequels.map((card) => card.id));
  const similarClean = similar.filter(
    (card, index) =>
      !sequelIds.has(card.id) && similar.findIndex((item) => item.id === card.id) === index
  );

  return {
    id: Number(kinopoiskId),
    name: data.title || data.name || "",
    alternativeName: data.original_title || data.original_name || "",
    enName: data.original_title || data.original_name || null,
    year: Number(String(data.release_date || data.first_air_date || "").slice(0, 4)) || null,
    type: media === "tv" ? (cartoon ? "animated-series" : "tv-series") : cartoon ? "cartoon" : "movie",
    description: data.overview || "",
    shortDescription: data.tagline || null,
    slogan: data.tagline || null,
    movieLength: data.runtime || (data.episode_run_time || [])[0] || null,
    ageRating: null,
    poster: { url: posterBig, previewUrl: posterSmall },
    backdrop: { url: backdrop },
    rating: {
      kp: data.vote_average || 0,
      imdb: 0,
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    votes: {
      kp: data.vote_count || 0,
      imdb: 0,
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    genres: genres.map((name) => ({ name })),
    countries: (data.production_countries || []).map((country) => ({
      name: countries.get(country.iso_3166_1) || country.name,
    })),
    facts: [],
    // apiget отдаёт факты и ляпы, у TMDB их нет — оставляем пустыми
    videos: trailer
      ? {
          trailers: [
            {
              url: `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`,
              name: trailer.name || "",
              site: "YouTube",
            },
          ],
          teasers: [],
        }
      : { trailers: [], teasers: [] },
    persons: [
      ...(data.credits?.cast || []).slice(0, 30).map((person) => ({
        id: person.id,
        name: person.name,
        enName: person.original_name || "",
        description: person.character || null,
        enProfession: "actor",
        profession: "Актер",
        photo: posterUrl(person.profile_path, "w185"),
      })),
      ...(data.credits?.crew || [])
        .filter((person) => ["Director", "Writer", "Producer"].includes(person.job))
        .map((person) => ({
          id: person.id,
          name: person.name,
          enName: person.original_name || "",
          description: null,
          enProfession: person.job.toLowerCase(),
          profession: person.job,
          photo: posterUrl(person.profile_path, "w185"),
        })),
    ],
    images: {
      postersCount: (data.images?.posters || []).length,
      backdropsCount: (data.images?.backdrops || []).length,
      framesCount: (data.images?.backdrops || []).length,
    },
    stills: (data.images?.backdrops || []).map((image) => posterUrl(image.file_path, "w780")),
    similarMovies: similarClean,
    sequelsAndPrequels: sequels,
    budget: { value: data.budget || null, currency: "$" },
    fees: {
      world: { value: data.revenue || null, currency: "$" },
      russia: { value: null, currency: "$" },
      usa: { value: null, currency: "$" },
    },
    externalId: { imdb: data.imdb_id || null },
    tmdbId: resolved.tmdbId,
    source: "tmdb",
  };
}
