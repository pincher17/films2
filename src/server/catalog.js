/**
 * Сборка списков фильмов для сайта: TMDB (фильтры + сортировка + точная
 * пагинация) -> Wikidata (kinopoisk_id) -> apiget list (данные карточки, один
 * раз на фильм) -> карточки в формате, который ждёт фронтенд.
 *
 * Тяжёлые клиентские фильтры из прошлой версии больше не нужны: диапазон лет,
 * рейтинг, сортировка, жанры и пагинация считаются на стороне TMDB. Локально
 * остаются только проверки, которых у TMDB нет: исключения стран, отсев
 * «короткометражек» по хронометражу и точная сверка года/рейтинга по данным КП.
 */

import { discover, posterUrl, resolveGenre, resolveKeywordId } from "./tmdb.js";
import { resolveRecords } from "./kpMap.js";

/**
 * Страниц TMDB на одну страницу сайта (страницы TMDB по 20 элементов).
 * Больше страниц = шире пул кандидатов: часть фильмов отсеивается локальными
 * фильтрами (исключения стран), поэтому 4 страницы дают полноценную выдачу.
 */
const TMDB_PAGES_PER_SITE_PAGE = 4;

/** Прогрев кэша: какие слайдеры главной страницы собрать заранее */
export const SLIDER_IDS = ["films", "series", "thriller", "comedy", "drama", "boevik", "detective", "fantasy", "new"];

const COUNTRIES_EXCLUDED_BY_DEFAULT = ["RU", "UA", "BY", "KZ", "KR", "CN", "TH", "IN", "JP", "TW", "TR"];
const ASIAN_LANGUAGES = ["ko", "zh", "th", "hi", "ja", "tr"];
const ASIAN_COUNTRIES = ["KR", "CN", "TH", "IN", "JP", "TW", "TR"];
const RU_COUNTRIES = ["RU", "BY", "KZ", "UA", "SU"];

const CARTOON_MARKERS = ["мультфильм", "анимац", "animation"];

function isCartoon(record) {
  const kpGenres = record.kpGenres || [];
  if (kpGenres.some((genre) => CARTOON_MARKERS.some((marker) => String(genre).toLowerCase().includes(marker)))) {
    return true;
  }
  return (record.genres || []).some((genre) =>
    CARTOON_MARKERS.some((marker) => String(genre).toLowerCase().includes(marker))
  );
}

function cardType(record) {
  const cartoon = isCartoon(record);
  if (record.media === "tv") return cartoon ? "animated-series" : "tv-series";
  return cartoon ? "cartoon" : "movie";
}

export function toCard(record) {
  const year = record.kpYear ?? record.tmdbYear ?? null;
  const name = record.kpTitle || record.tmdbTitle || "";
  const tmdbPoster = posterUrl(record.tmdbPoster);
  const big = record.kpPosterBig || tmdbPoster;
  const small = record.kpPosterSmall || tmdbPoster;

  return {
    id: record.kinopoiskId,
    name,
    alternativeName: name,
    enName: null,
    year,
    type: cardType(record),
    description: "",
    shortDescription: null,
    movieLength: null,
    rating: {
      kp: record.kpRating ?? record.tmdbRating ?? 0,
      imdb: 0,
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    votes: {
      kp: record.kpVotes ?? record.tmdbVotes ?? 0,
      imdb: 0,
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    poster: { url: big, previewUrl: small },
    logo: { url: null },
    externalId: { imdb: null },
    names: [],
  };
}

function inRange(value, range) {
  return typeof value === "number" && value >= range[0] && value <= range[1];
}

/** Фильтры TMDB по типу материала */
function mediaList(types) {
  const selected = String(types || "1,2,3").split(",");
  const has = (value) => selected.includes(value);
  const movies = has("1");
  const series = has("2");
  const cartoons = has("3");

  if (!movies && !series && !cartoons) return [];
  if (cartoons && !movies && !series) return ["movie", "tv"];
  if (series && !movies) return ["tv"];
  if (movies && !series && !cartoons) return ["movie"];
  return ["movie", "tv"];
}

async function buildServerParams(media, options) {
  const params = {};
  const isTv = media === "tv";

  if (options.yearFrom) params[isTv ? "first_air_date.gte" : "primary_release_date.gte"] = `${options.yearFrom}-01-01`;
  if (options.yearTo) params[isTv ? "first_air_date.lte" : "primary_release_date.lte"] = `${options.yearTo}-12-31`;

  // окно рейтинга шире выбранного: точную сверку делаем по рейтингу Кинопоиска
  if (options.ratingFrom !== undefined) params["vote_average.gte"] = Math.max(0, Number(options.ratingFrom) - 1.5);
  if (options.ratingTo !== undefined) params["vote_average.lte"] = Math.min(10, Number(options.ratingTo) + 1.5);

  /**
   * Порог по числу голосов. Замерено: при сортировке по дате и пороге >=300
   * Wikidata знает kinopoisk_id у 85% фильмов, при >=20 — только у 25%
   * (свежие релизы слишком нишевые). Для сортировки по популярности хватает 20.
   */
  params["vote_count.gte"] = options.voteCountMin ?? 300;
  if (!isTv) params["with_runtime.gte"] = 40; // вместо исключения «короткометражка»
  else params["without_genres"] = [10764, 10767, 10763, 10766].join(",");

  // подборки сортируются по рейтингу/популярности, каталог — по дате выхода
  if (options.sortBy) {
    params.sort_by = options.sortBy;
  } else if (options.sort === "1") {
    params.sort_by = isTv ? "first_air_date.asc" : "primary_release_date.asc";
  } else {
    params.sort_by = isTv ? "first_air_date.desc" : "primary_release_date.desc";
  }

  if (options.countryMode === "ru") params.with_original_language = "ru";

  // страницы студий: у сериалов берём сеть (что вышло на платформе),
  // у фильмов — продюсерскую компанию
  if (isTv && options.networkId) params.with_networks = options.networkId;
  else if (options.companyId) params.with_companies = options.companyId;

  if (options.cartoonsOnly) {
    const animation = await resolveGenre("мультфильм", media);
    if (animation) params.with_genres = String(animation.id);
  }

  for (const word of options.keywords || []) {
    const keywordId = await resolveKeywordId(word);
    if (keywordId) params.with_keywords = [params.with_keywords, keywordId].filter(Boolean).join(",");
  }

  const genreIds = [];
  for (const name of options.genres || []) {
    const genre = await resolveGenre(name, media);
    if (genre) genreIds.push(genre.id);
    else {
      const keywordId = await resolveKeywordId(name);
      if (keywordId) params.with_keywords = [params.with_keywords, keywordId].filter(Boolean).join(",");
    }
  }
  if (genreIds.length) {
    params.with_genres = [params.with_genres, ...genreIds].filter(Boolean).join(",");
  }

  const withoutGenres = [];
  for (const name of options.excludeGenres || []) {
    const genre = await resolveGenre(name, media);
    if (genre) withoutGenres.push(genre.id);
  }
  if (withoutGenres.length) {
    params.without_genres = [params.without_genres, ...withoutGenres].filter(Boolean).join(",");
  }

  return params;
}

/**
 * Дешёвый отсев по данным TMDB — до того, как мы потратим запросы на
 * сопоставление и карточку Кинопоиска.
 */
function buildPreFilter(options) {
  return (base) => {
    if (options.yearRange && base.tmdbYear) {
      const [from, to] = options.yearRange;
      if (base.tmdbYear < from - 1 || base.tmdbYear > to + 1) return false;
    }

    const countries = base.originCountry || [];
    const language = base.originalLanguage;

    if (options.countryMode === "ru") {
      return language === "ru" || countries.some((code) => RU_COUNTRIES.includes(code));
    }
    if (options.countryMode === "foreign" || options.excludeAsianByDefault) {
      if (countries.some((code) => ASIAN_COUNTRIES.includes(code))) return false;
      if (ASIAN_LANGUAGES.includes(language)) return false;
    }

    return true;
  };
}

function passesLocalFilters(record, options) {
  if (!record?.kinopoiskId) return false;

  const year = record.kpYear ?? record.tmdbYear;
  if (options.yearRange && !inRange(year, options.yearRange)) return false;

  const rating = record.kpRating ?? record.tmdbRating;
  if (options.ratingRange && !inRange(rating, options.ratingRange)) return false;

  const countries = record.originCountry || [];
  const language = record.originalLanguage;

  if (options.countryMode === "ru") {
    if (!(language === "ru" || countries.some((code) => RU_COUNTRIES.includes(code)))) return false;
  } else if (options.countryMode === "foreign") {
    if (countries.some((code) => COUNTRIES_EXCLUDED_BY_DEFAULT.includes(code))) return false;
    if (ASIAN_LANGUAGES.includes(language)) return false;
  } else if (options.excludeAsianByDefault) {
    if (countries.some((code) => ASIAN_COUNTRIES.includes(code))) return false;
    if (ASIAN_LANGUAGES.includes(language)) return false;
  }

  if (options.requirePoster && !record.kpPosterSmall && !record.kpPosterBig && !record.tmdbPoster) return false;

  return true;
}

function sortRecords(records, sort) {
  return records.slice().sort((a, b) => {
    const yearA = a.kpYear ?? a.tmdbYear ?? 0;
    const yearB = b.kpYear ?? b.tmdbYear ?? 0;
    if (yearA !== yearB) return sort === "1" ? yearA - yearB : yearB - yearA;
    const ratingA = a.kpRating ?? a.tmdbRating ?? 0;
    const ratingB = b.kpRating ?? b.tmdbRating ?? 0;
    if (ratingA !== ratingB) return ratingB - ratingA;
    return (b.kpVotes ?? b.tmdbVotes ?? 0) - (a.kpVotes ?? a.tmdbVotes ?? 0);
  });
}

/** Основной сборщик: options -> карточки сайта */
export async function buildList(options) {
  const media = mediaList(options.types);
  if (!media.length) return { docs: [], total: 0, page: options.page || 1, pages: 1, limit: options.limit };

  const page = options.page || 1;
  const pagesPerSite = options.tmdbPages ?? TMDB_PAGES_PER_SITE_PAGE;
  const firstTmdbPage = (page - 1) * pagesPerSite + 1;

  const requests = [];
  media.forEach((kind) => {
    for (let offset = 0; offset < pagesPerSite; offset += 1) {
      requests.push({ kind, tmdbPage: firstTmdbPage + offset });
    }
  });

  const paramsByMedia = new Map();
  for (const kind of media) {
    paramsByMedia.set(kind, await buildServerParams(kind, options));
  }

  const responses = await Promise.all(
    requests.map(async ({ kind, tmdbPage }) => ({
      kind,
      response: await discover(kind, { ...paramsByMedia.get(kind), page: tmdbPage }),
    }))
  );

  const byMedia = new Map();
  let totalResults = 0;
  let totalPages = 0;

  responses.forEach(({ kind, response }) => {
    const list = byMedia.get(kind) || new Map();
    (response.results || []).forEach((item) => list.set(item.id, item));
    byMedia.set(kind, list);
    // фильмы и сериалы запрашиваются отдельно — счётчики складываем,
    // иначе «всего» показывало только одну половину
    totalResults += response.totalResults || 0;
    totalPages += response.totalPages || 0;
  });

  const preFilter = buildPreFilter(options);

  const records = [];
  for (const [kind, list] of byMedia.entries()) {
    const items = [...list.values()];
    const resolved = await resolveRecords(kind, items, { preFilter });
    items.forEach((item) => {
      const record = resolved.get(item.id);
      if (record) records.push(record);
    });
  }

  const passed = records.filter((record) => passesLocalFilters(record, options));
  const filtered = options.ratingSort
    ? passed.sort(
        (a, b) =>
          (b.kpRating ?? b.tmdbRating ?? 0) - (a.kpRating ?? a.tmdbRating ?? 0) ||
          (b.kpVotes ?? b.tmdbVotes ?? 0) - (a.kpVotes ?? a.tmdbVotes ?? 0)
      )
    : sortRecords(passed, options.sort);
  const docs = filtered.slice(0, options.limit).map(toCard).filter((card) => card.id);

  const sitePages = totalPages ? Math.max(1, Math.ceil(totalPages / pagesPerSite)) : page;

  return {
    docs,
    total: totalResults,
    page,
    pages: sitePages,
    limit: options.limit,
  };
}

// ------------------------------------------------------------ пресеты сайта

const SLIDERS = {
  films: { types: "1", years: [2021, 2024], ratings: [6, 10] },
  series: { types: "2", years: [2019, 2024], ratings: [6.5, 10] },
  thriller: { types: "1", genres: ["триллер"], years: [2019, 2024], ratings: [6.5, 10] },
  comedy: { types: "1", genres: ["комедия"], years: [2019, 2024], ratings: [6.5, 10] },
  drama: { types: "1", genres: ["драма"], years: [2019, 2024], ratings: [6.5, 10] },
  boevik: { types: "1", genres: ["боевик"], years: [2019, 2024], ratings: [6.5, 10] },
  detective: { types: "1", genres: ["детектив"], years: [2019, 2024], ratings: [6.5, 10] },
  fantasy: { types: "1", genres: ["фантастика"], years: [2019, 2024], ratings: [6.5, 10] },
  new: { types: "1", years: [2024, 2024], ratings: [6.5, 10] },
};

export function buildSlider(slider, limit = 25, voteCountMin) {
  const preset = SLIDERS[slider] || SLIDERS.films;
  return buildList({
    voteCountMin,
    types: preset.types,
    genres: preset.genres || [],
    yearRange: preset.years,
    yearFrom: preset.years[0],
    yearTo: preset.years[1],
    ratingRange: preset.ratings,
    ratingFrom: preset.ratings[0],
    ratingTo: preset.ratings[1],
    sort: "-1",
    limit,
    page: 1,
    excludeAsianByDefault: true,
    countryMode: "all",
    requirePoster: true,
  });
}

/** «Топ-10»: вместо мусорного apiget top250 — популярное в TMDB */
export async function buildTop(limit = 10) {
  const responses = await Promise.all([
    discover("movie", { sort_by: "popularity.desc", "vote_count.gte": 300, page: 1 }),
    discover("tv", { sort_by: "popularity.desc", "vote_count.gte": 100, page: 1 }),
  ]);

  const records = [];
  for (const [index, response] of responses.entries()) {
    const kind = index === 0 ? "movie" : "tv";
    const items = response.results || [];
    const resolved = await resolveRecords(kind, items, {
      preFilter: buildPreFilter({ excludeAsianByDefault: true }),
    });
    items.forEach((item) => {
      const record = resolved.get(item.id);
      if (record) records.push(record);
    });
  }

  const sorted = records
    .filter((record) => passesLocalFilters(record, { excludeAsianByDefault: true, requirePoster: true }))
    .sort((a, b) => (b.tmdbRating ?? 0) - (a.tmdbRating ?? 0) || (b.kpVotes ?? 0) - (a.kpVotes ?? 0));

  const docs = sorted.slice(0, limit).map(toCard).filter((card) => card.id);
  return { docs, total: docs.length, page: 1, pages: 1, limit };
}
