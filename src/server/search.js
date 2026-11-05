/**
 * Поиск фильмов и сериалов через TMDB.
 *
 * apiget для поиска больше не нужен: TMDB отдаёт и результаты, и точное число
 * найденного. kinopoisk_id (он нужен карточкам, странице фильма и плеерам)
 * восстанавливается через Wikidata тем же способом, что и на странице фильма.
 */

import { tmdbGet, posterUrl } from "./tmdb.js";
import { resolveKinopoiskByTmdbIds } from "./filmPage.js";
import { prisma } from "./prisma.js";

const PAGE_SIZE = 10;
const TMDB_PAGE_SIZE = 20;

/** Сколько вариантов с «ё» пробуем, если обычный запрос почти ничего не дал */
const YO_VARIANTS_MAX = 4;
/** Ниже этого числа результатов включаем запасной поиск */
const YO_FALLBACK_BELOW = 3;

/**
 * Варианты запроса, где в одном слове «е» заменена на «ё».
 *
 * TMDB не считает «ё» за «е»: «зеленая миля» даёт ноль результатов, а
 * «зелёная миля» — нужный фильм. Люди почти всегда пишут без точек, поэтому
 * пробуем по одной замене за раз: для «зеленая» это «зёленая» и «зелёная»,
 * вторая и срабатывает.
 */
function yoVariants(query) {
  const parts = String(query).split(/(\s+)/);
  const variants = [];
  parts.forEach((word, index) => {
    if (!/[еЕ]/.test(word)) return;
    for (let pos = 0; pos < word.length; pos += 1) {
      if (!/[еЕ]/.test(word[pos])) continue;
      const letter = word[pos] === "Е" ? "Ё" : "ё";
      const next = [...parts];
      next[index] = word.slice(0, pos) + letter + word.slice(pos + 1);
      variants.push(next.join(""));
    }
  });
  return [...new Set(variants)].filter((variant) => variant !== query);
}

/** Обратный случай: набрали «ё», а в названии её нет */
function withoutYo(query) {
  return String(query).replace(/ё/g, "е").replace(/Ё/g, "Е");
}

function toCard(item, kinopoiskId) {
  const poster = posterUrl(item.poster_path, "w500");
  const media = item.media_type === "tv" || item.first_air_date ? "tv" : "movie";
  const date = item.release_date || item.first_air_date || "";

  return {
    id: kinopoiskId,
    name: item.title || item.name || "",
    alternativeName: item.original_title || item.original_name || "",
    enName: item.original_title || item.original_name || null,
    year: Number(date.slice(0, 4)) || null,
    type: media === "tv" ? "tv-series" : "movie",
    description: item.overview || "",
    shortDescription: null,
    movieLength: null,
    rating: {
      kp: item.vote_average || 0,
      imdb: 0,
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    votes: {
      kp: item.vote_count || 0,
      imdb: 0,
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    poster: { url: poster, previewUrl: poster },
    logo: { url: null },
    externalId: { imdb: null },
    names: [],
  };
}

export async function searchFilms(query, page = 1) {
  const empty = { docs: [], total: 0, page, pages: page, limit: PAGE_SIZE };
  if (!query) return empty;

  const tmdbPage = Math.ceil(page / (TMDB_PAGE_SIZE / PAGE_SIZE));
  const offset = ((page - 1) * PAGE_SIZE) % TMDB_PAGE_SIZE;

  const data = await tmdbGet("/search/multi", {
    query,
    page: tmdbPage,
    include_adult: false,
  });

  if (data.__error__) return empty;

  let items = (data.results || []).filter(
    (item) => item.media_type === "movie" || item.media_type === "tv"
  );

  /* Если нашлось мало и «ё» в запросе нет — ищем ещё и с точками.
     Лишние запросы идут только в этом случае, обычный поиск не дороже. */
  if (items.length < YO_FALLBACK_BELOW) {
    const variants = /[ёЁ]/.test(query)
      ? [withoutYo(query)] // набрали с точками — пробуем без них
      : yoVariants(query).slice(0, YO_VARIANTS_MAX);
    if (variants.length) {
      const extra = await Promise.all(
        variants.map((variant) =>
          tmdbGet("/search/multi", { query: variant, page: tmdbPage, include_adult: false })
        )
      );
      const seenIds = new Set(items.map((item) => `${item.media_type}:${item.id}`));
      for (const chunk of extra) {
        if (!chunk || chunk.__error__) continue;
        for (const item of chunk.results || []) {
          if (item.media_type !== "movie" && item.media_type !== "tv") continue;
          const key = `${item.media_type}:${item.id}`;
          if (seenIds.has(key)) continue;
          seenIds.add(key);
          items.push(item);
        }
      }
      // после объединения возвращаем привычный порядок — по популярности
      items = items.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    }
  }

  // собираем кинопоисковские id: сначала фильмы, потом сериалы
  const movies = items.filter((item) => item.media_type === "movie");
  const shows = items.filter((item) => item.media_type === "tv");
  const [movieIds, showIds] = await Promise.all([
    resolveKinopoiskByTmdbIds(movies.map((item) => item.id), "movie"),
    resolveKinopoiskByTmdbIds(shows.map((item) => item.id), "tv"),
  ]);

  /* У зарубежного контента кинопоискового id часто нет — тогда показываем
     фильм по imdb-адресу (tt...), плеер его принимает. */
  const imdbByFilm = new Map();
  try {
    const rows = await prisma.imdbMap.findMany({
      where: {
        OR: [
          { media: "movie", tmdbId: { in: movies.map((item) => item.id) } },
          { media: "tv", tmdbId: { in: shows.map((item) => item.id) } },
        ],
      },
      select: { tmdbId: true, media: true, imdbId: true },
    });
    rows.forEach((row) => imdbByFilm.set(`${row.media}:${row.tmdbId}`, row.imdbId));
  } catch {
    undefined;
  }

  const seen = new Set();
  const docs = items
    .map((item) => {
      const map = item.media_type === "movie" ? movieIds : showIds;
      const kinopoiskId = map.get(item.id);
      const imdbId = imdbByFilm.get(`${item.media_type}:${item.id}`);
      // кинопоисковый адрес в приоритете, imdb — запасной
      const cardId = kinopoiskId || imdbId;
      if (!cardId || seen.has(cardId)) return null;
      seen.add(cardId);
      return toCard(item, cardId);
    })
    .filter(Boolean);

  const slice = docs.slice(offset, offset + PAGE_SIZE);
  const totalPages = Math.max(data.total_pages || 0, items.length ? 1 : 0) * (TMDB_PAGE_SIZE / PAGE_SIZE);

  return {
    docs: slice,
    /* при запасном поиске с «ё» TMDB мог вернуть ноль — тогда считаем по факту */
    total: Math.max(data.total_results || 0, items.length),
    page,
    pages: totalPages || page,
    limit: PAGE_SIZE,
  };
}
