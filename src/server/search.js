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

  const items = (data.results || []).filter(
    (item) => item.media_type === "movie" || item.media_type === "tv"
  );

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
  const totalPages = (data.total_pages || 0) * (TMDB_PAGE_SIZE / PAGE_SIZE);

  return {
    docs: slice,
    total: data.total_results || 0,
    page,
    pages: totalPages || page,
    limit: PAGE_SIZE,
  };
}
