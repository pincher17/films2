import axios from "axios";


export const instance = axios.create({
    baseURL: 'https://api.kinopoisk.dev/v1.4/',
    headers: {
        'accept': 'application/json',
        'X-API-KEY': 'K5PMTVP-KZ9MAA5-K088YXZ-YZ51Q77',
      }
})

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
    getFilmSearchV4(query, page = 1){
        /* return instance.get(`movie?search=${query}&field=name&limit=10&isStrict=false&sortField=votes.imdb&sortType=-1&token=${TOKEN}`) */
        return instance.get(`movie/search?page=${page}&limit=10&query=${query}`)
        .then(response =>{
            return response;
        })
    },
    getFilms(filters, page, genre = []){
        const genreToUse = genre.length ? genre : filters.genre;
        return instance.get(`movie?page=${page}&limit=40&sortField=year&sortType=-1&type=${filters.selectedTypeOfMovies.map((item) => `&typeNumber=${item}&`).join('')}${genreToUse.length ? genreToUse.map((item) => `&genres.name=${item.value}&`).join('') : '&genres.name=!документальный&genres.name=!ток-шоу&genres.name=!реальное ТВ&genres.name=!короткометражка&genres.name=!церемония&genres.name=!игра&genres.name=!концерт&genres.name=!для взрослых'}&year=${filters.year[0]}-${filters.year[1]}&rating.kp=${filters.rating[0]}-${filters.rating[1]}&field=poster&search=!null${filters.country.value ? filters.country.value : `&countries.name=!Корея Южная&countries.name=!Китай&countries.name=!Таиланд&countries.name=!Индия&countries.name=!Япония&countries.name=!Тайвань&countries.name=!Турция`}`)
        /* return instance.get(`movie?${filters.selectedTypeOfMovies.map((item)=>`&typeNumber=${item}&`).join('')}${filters.genre.length ? filters.genre.map((item)=>`&genres.name=${item.value}&`).join(''):''}${genre ? `&genres.name=${genre}`: ''}&genres.name=!документальный&genres.name=!ток-шоу&genres.name=!реальное ТВ&genres.name=!короткометражка&genres.name=!церемония&genres.name=!игра&genres.name=!концерт&genres.name=!для взрослых&year=${filters.year[0]}-${filters.year[1]}&rating.kp=${filters.rating[0]}-${filters.rating[1]}&sortField[]=year&sortType[]=${filters.sortByRelease}&limit=40&page=${page}&field=poster&search=!null&countries.name=!Корея Южная&countries.name=!Китай&countries.name=!Таиланд&countries.name=!Индия&countries.name=!Япония&countries.name=!Тайвань&countries.name=!Турция`) */
        /* return instance.get(`movie?field[]=genres.name&search[]=драма&field[]=year&search[]=${filters.year}&field=rating.kp&search[]=${filters.rating}&field[]=typeNumber&search[]=1&field[]=votes.kp&search[]=!null&sortField[]=year&sortType[]=${filters.sortByRelease}&limit=30&page=${page}&field=poster&search=!null&token=${TOKEN}`) */
        /* return instance.get(`movie?${filters.genre}&search[]=${filters.year}&field[]=year&search[]=${filters.rating}&field=rating.kp&search=!null&field=name&search=1&field=typeNumber&search=!null&field=votes.kp&sortField=year&sortType=${filters.sortByRelease}&limit=30&page=${page}&token=${TOKEN}`) */
        .then(response =>{
            return response;
        })
    },
}
