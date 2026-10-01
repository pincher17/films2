import axios from "axios";
import { apigetInstance, apigetApi } from "./apiget.js";
import { emptyDocsResponse, toSearchResponse } from "./apigetAdapter.js";
import { fetchCatalog, fetchStudio } from "./catalogQuery.js";

/**
 * Поиск и каталог.
 *
 *  - Поиск идёт напрямую в apiget: он сразу отдаёт кинопоисковские id и постеры,
 *    это 1 запрос на страницу выдачи.
 *  - Каталог собирает серверный роут /api/catalog (TMDB + Wikidata + кэш apiget):
 *    диапазон лет, рейтинг, сортировка и пагинация считаются на стороне TMDB.
 *
 * Коллекции (lists / list) и студии (networks) остались на прежнем API: в TMDB
 * подборки и сети устроены иначе, их перенос — отдельный шаг.
 */
export const instance = axios.create({
    baseURL: 'https://api.kinopoisk.dev/v1.4/',
    headers: {
        'accept': 'application/json',
        'X-API-KEY': process.env.apiKey,
      }
})

export const apiget = apigetInstance;

const SEARCH_LIMIT = 10;
const CATALOG_LIMIT = 40;

export const filmsApiV4 = {
    getFilmsSlug(slug, page){
        return instance.get(`movie?page=${page}&limit=40&selectFields=id&selectFields=name&selectFields=year&selectFields=rating&selectFields=poster&notNullFields=id&notNullFields=name&notNullFields=rating.kp&notNullFields=poster.url&lists=${slug}`).then(response =>{
            return response;
        })
    },
    getInfoSlug(slug){
        return instance.get(`list/${slug}`).then(response =>{
            return response;
        })
    },

    /**
     * Поиск по названию.
     * Основной источник — TMDB (бесплатно, точное число найденного),
     * запасной — apiget, если TMDB ничего не отдал.
     */
    async getFilmSearchV4(query, page = 1){
        try {
            const response = await axios.get("/api/search", {
                params: { query, page, limit: SEARCH_LIMIT },
            });
            const data = response.data || {};

            if (data.docs?.length) {
                return {
                    data: {
                        docs: data.docs,
                        total: data.total || 0,
                        page: data.page || page,
                        pages: data.pages || page,
                        limit: data.limit || SEARCH_LIMIT,
                    },
                };
            }
        } catch (error) {
            console.warn("[search] /api/search недоступен:", error?.message);
        }

        const response = await apigetApi.search({ query, page, limit: SEARCH_LIMIT });

        if (!response.results?.length) return emptyDocsResponse(page, SEARCH_LIMIT);

        return toSearchResponse(response, { page, limit: SEARCH_LIMIT });
    },

    /** Каталог: год, рейтинг, жанры, страны, тип, сортировка, пагинация */
    async getFilms(filters, page, genre = []){
        return fetchCatalog(filters, page, genre, CATALOG_LIMIT);
    },

    /** Страница студии: фильмы продюсерской компании через TMDB */
    async getFilmsStudio(filters, page, nameStudio){
        return fetchStudio(
            {
                ...filters,
                genre: filters.genres,
                selectedTypeOfMovies: filters.selectedTypeOfMovies,
                year: filters.year,
                rating: filters.rating,
            },
            page,
            nameStudio,
            CATALOG_LIMIT
        );
    },
}
