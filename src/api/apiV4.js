import axios from "axios";
import { apigetInstance, apigetApi } from "./apiget.js";
import { emptyDocsResponse, toSearchResponse } from "./apigetAdapter.js";
import { fetchCatalog } from "./catalogQuery.js";

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

    /** Поиск по названию. apiget не отдаёт общее число найденного — только has_next */
    async getFilmSearchV4(query, page = 1){
        const response = await apigetApi.search({ query, page, limit: SEARCH_LIMIT });

        if (!response.results?.length) return emptyDocsResponse(page, SEARCH_LIMIT);

        return toSearchResponse(response, { page, limit: SEARCH_LIMIT });
    },

    /** Каталог: год, рейтинг, жанры, страны, тип, сортировка, пагинация */
    async getFilms(filters, page, genre = []){
        return fetchCatalog(filters, page, genre, CATALOG_LIMIT);
    },

    getFilmsStudio(filters, page, nameStudio){
        const genreToUse = filters.genres;
        return instance.get(`movie?page=${page}&limit=40&networks.items.name=${nameStudio}&sortField=year&sortType=-1&type=${filters.selectedTypeOfMovies.map((item) => `&typeNumber=${item}&`).join('')}${genreToUse.length ? genreToUse.map((item) => `&genres.name=${item.value}`).join('') : '&genres.name=!ток-шоу&genres.name=!реальное ТВ&genres.name=!короткометражка&genres.name=!церемония&genres.name=!игра&genres.name=!концерт&genres.name=!для взрослых'}&year=${filters.year[0]}-${filters.year[1]}&rating.kp=${filters.rating[0]}-${filters.rating[1]}&field=poster&search=!null${filters.country.value ? filters.country.value : `&countries.name=!Корея Южная&countries.name=!Китай&countries.name=!Таиланд&countries.name=!Индия&countries.name=!Япония&countries.name=!Тайвань&countries.name=!Турция`}`)
        .then(response =>{
            return response;
        })
    },
}
