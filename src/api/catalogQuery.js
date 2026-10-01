import axios from "axios";

/**
 * Клиентская обёртка над серверным роутом /api/catalog.
 *
 * Списки фильмов (каталог, слайдеры главной, топ) собирает сервер: TMDB даёт
 * фильтры, сортировку и пагинацию, Wikidata — kinopoisk_id, apiget — данные
 * карточки (один раз на фильм, дальше из кэша). Браузер ключей не видит.
 */

const CATALOG_URL = "/api/catalog";

function emptyDocs(page = 1, limit = 0) {
  return { data: { docs: [], total: 0, page, pages: page, limit } };
}

async function requestList(params) {
  try {
    const response = await axios.get(CATALOG_URL, { params });
    const data = response.data || {};
    return {
      data: {
        docs: Array.isArray(data.docs) ? data.docs : [],
        total: data.total || 0,
        page: data.page || params.page || 1,
        pages: data.pages || 1,
        limit: data.limit || params.limit || 0,
      },
    };
  } catch (error) {
    console.warn("[catalog] /api/catalog недоступен:", error?.message);
    return emptyDocs(params.page || 1, params.limit || 0);
  }
}

export function normalizeGenres(genres) {
  if (!Array.isArray(genres)) return [];
  return genres
    .map((genre) => (typeof genre === "string" ? genre : genre?.value ?? genre?.label))
    .filter((genre) => typeof genre === "string" && genre.trim().length > 0);
}

/**
 * Фильтр стран на сайте хранит готовый фрагмент старого запроса
 * (например "&countries.name=!Китай"), поэтому режим определяется по нему.
 */
function countryMode(country) {
  const raw = Array.isArray(country) ? country[0]?.value : country;
  if (!raw || typeof raw !== "string") return "all";
  return raw.includes("!") ? "foreign" : "ru";
}

export function buildCatalogParams(filters = {}, page = 1, genre = [], limit = 40) {
  const genres = normalizeGenres(genre && genre.length ? genre : filters.genre);
  const years = filters.year || [1960, 2024];
  const ratings = filters.rating || [1, 10];
  const types = filters.selectedTypeOfMovies || [];

  return {
    task: "catalog",
    page,
    limit,
    yearFrom: years[0],
    yearTo: years[1],
    ratingFrom: ratings[0],
    ratingTo: ratings[1],
    types: types.length ? types.join(",") : "1,2,3",
    genres: genres.join(","),
    country: countryMode(filters.country),
    sort: filters.sortByRelease === "1" ? "1" : "-1",
  };
}

export function fetchCatalog(filters, page = 1, genre = [], limit = 40) {
  return requestList(buildCatalogParams(filters, page, genre, limit));
}

/** Страница студии: тот же каталог, но по продюсерской компании */
export function fetchStudio(filters, page, company, limit = 40) {
  return requestList({
    ...buildCatalogParams(filters, page, [], limit),
    task: "studio",
    company,
  });
}

export function fetchSlider(slider, limit = 25) {
  return requestList({ task: "slider", slider, limit });
}

export function fetchTop(limit = 10) {
  return requestList({ task: "top", limit });
}

export function fetchCacheStats() {
  return requestList({ task: "stats", limit: 1 });
}
