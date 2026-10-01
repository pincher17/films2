import axios from "axios";
import { apigetApi, apigetInstance } from "./apiget.js";
import {
  emptyDocsResponse,
  emptyFilmInfo,
  toFilmInfo,
  toSearchResponse,
} from "./apigetAdapter.js";
import { fetchCatalog, fetchSlider, fetchTop } from "./catalogQuery.js";

/**
 * Данные сайта.
 *
 *  - Списки (главная, каталог, топ) собирает серверный роут /api/catalog:
 *    TMDB даёт фильтры, сортировку и пагинацию, Wikidata — kinopoisk_id,
 *    apiget — данные карточки (один раз на фильм, дальше из файлового кэша).
 *  - Страница фильма и поиск идут напрямую в apiget (1 запрос на страницу).
 *
 * Публичный интерфейс методов прежний, поэтому компоненты и redux не менялись.
 */

export const instance = apigetInstance;

export const filmsApi = {
  /** Новинки: фильмы 2024 года с рейтингом от 6.5 */
  getNewFilms(limit = 10) {
    return fetchSlider("new", limit);
  },

  getFilmsMainPage() {
    return fetchSlider("films", 25);
  },

  getSeriesMainPage() {
    return fetchSlider("series", 25);
  },

  getFilmsBoevikMainPage() {
    return fetchSlider("boevik", 25);
  },

  getFilmsDetectiveMainPage() {
    return fetchSlider("detective", 25);
  },

  getFilmsDramaMainPage() {
    return fetchSlider("drama", 25);
  },

  getFilmsComedyMainPage() {
    return fetchSlider("comedy", 25);
  },

  getFilmsThrillerMainPage() {
    return fetchSlider("thriller", 25);
  },

  getFilmsFantasyMainPage() {
    return fetchSlider("fantasy", 25);
  },

  /** «Топ 10» — популярное в TMDB (у apiget вместо топа был мусорный top250) */
  getFilmsTop10() {
    return fetchTop(10);
  },

  /** Каталог с фильтрами (на сайте используется версия из apiV4) */
  getFilms(filters, page = 1, genre = []) {
    return fetchCatalog(filters, page, genre, 40);
  },

  /**
   * Страница фильма.
   * Основной источник — TMDB (бесплатно): постеры, описание, жанры, страны,
   * актёры, трейлер, похожие, сиквелы и приквелы.
   * Если фильма в TMDB нет — запасной вариант apiget get-info.
   */
  async getFilmById(id) {
    try {
      const response = await axios.get("/api/film", { params: { id } });
      const info = response.data?.info;

      if (info?.name) return { data: info };
    } catch (error) {
      console.warn("[film] /api/film недоступен:", error?.message);
    }

    const response = await apigetApi.getInfo(id);

    if (response.error !== 0 || !response.kinopoisk_id) {
      return { data: emptyFilmInfo(Number(id) || id) };
    }

    return { data: toFilmInfo(response) };
  },

  /** Поиск по названию: 1 запрос к apiget, id уже кинопоисковые */
  async getFilmSearch(query, page = 1) {
    const limit = 10;
    const response = await apigetApi.search({ query, page, limit });

    if (!response.results?.length) return emptyDocsResponse(page, limit);

    return toSearchResponse(response, { page, limit });
  },
};
