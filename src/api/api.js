import axios from "axios";


export const instance = axios.create({
    baseURL: 'https://api.kinopoisk.dev/v1.3/',
    headers: {
        'accept': 'application/json',
        'X-API-KEY': 'K5PMTVP-KZ9MAA5-K088YXZ-YZ51Q77',
      }
})

export const filmsApi = {
    getNewFilms(limit){
        return instance.get(`movie?field=rating.kp&search=6.5-10&field=year&search=2022&field=typeNumber&search=1&limit=${limit}&sortField=year&sortType=1&sortField=votes.imdb&sortType=-1`).then(response =>{
            return response;
        })
    },
    getFilmsMainPage(){
        return instance.get(`movie?page=1&limit=25&type=movie&year=2021-2023&rating.kp=6-10&genres.name=%21%D1%82%D0%BE%D0%BA-%D1%88%D0%BE%D1%83&genres.name=%21%D1%80%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%A2%D0%92&genres.name=%21%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B0%D0%B6%D0%BA%D0%B0&genres.name=%21%D1%86%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D0%B8%D1%8F&genres.name=%21%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%98%D0%BD%D0%B4%D0%B8%D1%8F&countries.name=%21%D0%A2%D0%B0%D0%B8%D0%BB%D0%B0%D0%BD%D0%B4&countries.name=%21%D0%9A%D0%B8%D1%82%D0%B0%D0%B9&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%AF%D0%BF%D0%BE%D0%BD%D0%B8%D1%8F`).then(response =>{
            return response;
        })
    },
    getSeriesMainPage(){
        return instance.get(`movie?page=1&limit=25&type=tv-series&year=2019-2023&rating.kp=6.5-10&genres.name=%21%D1%82%D0%BE%D0%BA-%D1%88%D0%BE%D1%83&genres.name=%21%D1%80%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%A2%D0%92&genres.name=%21%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B0%D0%B6%D0%BA%D0%B0&genres.name=%21%D1%86%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D0%B8%D1%8F&genres.name=%21%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%98%D0%BD%D0%B4%D0%B8%D1%8F&countries.name=%21%D0%A2%D0%B0%D0%B8%D0%BB%D0%B0%D0%BD%D0%B4&countries.name=%21%D0%9A%D0%B8%D1%82%D0%B0%D0%B9&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%AF%D0%BF%D0%BE%D0%BD%D0%B8%D1%8F`).then(response =>{
            return response;
        })
    },
    getFilmsBoevikMainPage(){
        return instance.get(`movie?page=1&limit=25&type=movie&year=2019-2023&rating.kp=6.5-10&genres.name=%21%D1%82%D0%BE%D0%BA-%D1%88%D0%BE%D1%83&genres.name=%21%D1%80%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%A2%D0%92&genres.name=%21%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B0%D0%B6%D0%BA%D0%B0&genres.name=%21%D1%86%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D0%B8%D1%8F&genres.name=%21%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9&genres.name=%D0%B1%D0%BE%D0%B5%D0%B2%D0%B8%D0%BA&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%98%D0%BD%D0%B4%D0%B8%D1%8F&countries.name=%21%D0%A2%D0%B0%D0%B8%D0%BB%D0%B0%D0%BD%D0%B4&countries.name=%21%D0%9A%D0%B8%D1%82%D0%B0%D0%B9&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%AF%D0%BF%D0%BE%D0%BD%D0%B8%D1%8F`).then(response =>{
            return response;
        })
    },
    getFilmsDetectiveMainPage(){
        return instance.get(`movie?page=1&limit=25&type=movie&year=2019-2023&rating.kp=6.5-10&genres.name=%21%D1%82%D0%BE%D0%BA-%D1%88%D0%BE%D1%83&genres.name=%21%D1%80%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%A2%D0%92&genres.name=%21%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B0%D0%B6%D0%BA%D0%B0&genres.name=%21%D1%86%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D0%B8%D1%8F&genres.name=%21%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9&genres.name=%D0%B4%D0%B5%D1%82%D0%B5%D0%BA%D1%82%D0%B8%D0%B2&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%98%D0%BD%D0%B4%D0%B8%D1%8F&countries.name=%21%D0%A2%D0%B0%D0%B8%D0%BB%D0%B0%D0%BD%D0%B4&countries.name=%21%D0%9A%D0%B8%D1%82%D0%B0%D0%B9&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%AF%D0%BF%D0%BE%D0%BD%D0%B8%D1%8F`).then(response =>{
            return response;
        })
    },
    getFilmsDramaMainPage(){
        return instance.get(`movie?page=1&limit=25&type=movie&year=2019-2023&rating.kp=6.5-10&genres.name=%21%D1%82%D0%BE%D0%BA-%D1%88%D0%BE%D1%83&genres.name=%21%D1%80%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%A2%D0%92&genres.name=%21%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B0%D0%B6%D0%BA%D0%B0&genres.name=%21%D1%86%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D0%B8%D1%8F&genres.name=%21%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9&genres.name=%D0%B4%D1%80%D0%B0%D0%BC%D0%B0&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%98%D0%BD%D0%B4%D0%B8%D1%8F&countries.name=%21%D0%A2%D0%B0%D0%B8%D0%BB%D0%B0%D0%BD%D0%B4&countries.name=%21%D0%9A%D0%B8%D1%82%D0%B0%D0%B9&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%AF%D0%BF%D0%BE%D0%BD%D0%B8%D1%8F`).then(response =>{
            return response;
        })
    },
    getFilmsComedyMainPage(){
        return instance.get(`movie?page=1&limit=25&type=movie&year=2019-2023&rating.kp=6.5-10&genres.name=%21%D1%82%D0%BE%D0%BA-%D1%88%D0%BE%D1%83&genres.name=%21%D1%80%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%A2%D0%92&genres.name=%21%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B0%D0%B6%D0%BA%D0%B0&genres.name=%21%D1%86%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D0%B8%D1%8F&genres.name=%21%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9&genres.name=%D0%BA%D0%BE%D0%BC%D0%B5%D0%B4%D0%B8%D1%8F&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%98%D0%BD%D0%B4%D0%B8%D1%8F&countries.name=%21%D0%A2%D0%B0%D0%B8%D0%BB%D0%B0%D0%BD%D0%B4&countries.name=%21%D0%9A%D0%B8%D1%82%D0%B0%D0%B9&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%AF%D0%BF%D0%BE%D0%BD%D0%B8%D1%8F`).then(response =>{
            return response;
        })
    },
    getFilmsThrillerMainPage(){
        return instance.get(`movie?page=1&limit=25&type=movie&year=2019-2023&rating.kp=6.5-10&genres.name=%21%D1%82%D0%BE%D0%BA-%D1%88%D0%BE%D1%83&genres.name=%21%D1%80%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%A2%D0%92&genres.name=%21%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B0%D0%B6%D0%BA%D0%B0&genres.name=%21%D1%86%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D0%B8%D1%8F&genres.name=%21%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9&genres.name=%D1%82%D1%80%D0%B8%D0%BB%D0%BB%D0%B5%D1%80&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%98%D0%BD%D0%B4%D0%B8%D1%8F&countries.name=%21%D0%A2%D0%B0%D0%B8%D0%BB%D0%B0%D0%BD%D0%B4&countries.name=%21%D0%9A%D0%B8%D1%82%D0%B0%D0%B9&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%AF%D0%BF%D0%BE%D0%BD%D0%B8%D1%8F`).then(response =>{
            return response;
        })
    },
    getFilmsFantasyMainPage(){
        return instance.get(`movie?page=1&limit=25&type=movie&year=2019-2023&rating.kp=6.5-10&genres.name=%21%D1%82%D0%BE%D0%BA-%D1%88%D0%BE%D1%83&genres.name=%21%D1%80%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5%20%D0%A2%D0%92&genres.name=%21%D0%BA%D0%BE%D1%80%D0%BE%D1%82%D0%BA%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B0%D0%B6%D0%BA%D0%B0&genres.name=%21%D1%86%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D0%B8%D1%8F&genres.name=%21%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9&genres.name=%D1%84%D0%B0%D0%BD%D1%82%D0%B0%D1%81%D1%82%D0%B8%D0%BA%D0%B0&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%98%D0%BD%D0%B4%D0%B8%D1%8F&countries.name=%21%D0%A2%D0%B0%D0%B8%D0%BB%D0%B0%D0%BD%D0%B4&countries.name=%21%D0%9A%D0%B8%D1%82%D0%B0%D0%B9&countries.name=%21%D0%9A%D0%BE%D1%80%D0%B5%D1%8F%20%D0%AE%D0%B6%D0%BD%D0%B0%D1%8F&countries.name=%21%D0%AF%D0%BF%D0%BE%D0%BD%D0%B8%D1%8F`).then(response =>{
            return response;
        })
    },
    getFilmsTop10(){
        return instance.get(`movie?top10=%21null`).then(response =>{
            return response;
        })
    },
    getFilmById(id){
        return instance.get(`movie/${id}`).then(response =>{
            return response;
        })
    },
    getFilmSearch(query, page = 1){
        /* return instance.get(`movie?search=${query}&field=name&limit=10&isStrict=false&sortField=votes.imdb&sortType=-1&token=${TOKEN}`) */
        return instance.get(`movie?search=${query}&field=name&page=${page}&limit=10&isStrict=false&sortField[]=votes.kp&sortField[]=premiere.world&sortType[]=-1&sortType[]=-1`)
        .then(response =>{
            return response;
        })
    },
    getFilms(filters, page, genre = []){
        const genreToUse = genre.length ? genre : filters.genre;
        return instance.get(`movie?${filters.selectedTypeOfMovies.map((item) => `&typeNumber=${item}&`).join('')}${genreToUse.length ? genreToUse.map((item) => `&genres.name=${item.value}&`).join('') : ''}&genres.name=!документальный&genres.name=!ток-шоу&genres.name=!реальное ТВ&genres.name=!короткометражка&genres.name=!церемония&genres.name=!игра&genres.name=!концерт&genres.name=!для взрослых&year=${filters.year[0]}-${filters.year[1]}&rating.kp=${filters.rating[0]}-${filters.rating[1]}&sortField[]=year&sortType[]=${filters.sortByRelease}&limit=40&page=${page}&field=poster&search=!null&countries.name=!Корея Южная&countries.name=!Китай&countries.name=!Таиланд&countries.name=!Индия&countries.name=!Япония&countries.name=!Тайвань&countries.name=!Турция${filters.country.value}`)
        /* return instance.get(`movie?${filters.selectedTypeOfMovies.map((item)=>`&typeNumber=${item}&`).join('')}${filters.genre.length ? filters.genre.map((item)=>`&genres.name=${item.value}&`).join(''):''}${genre ? `&genres.name=${genre}`: ''}&genres.name=!документальный&genres.name=!ток-шоу&genres.name=!реальное ТВ&genres.name=!короткометражка&genres.name=!церемония&genres.name=!игра&genres.name=!концерт&genres.name=!для взрослых&year=${filters.year[0]}-${filters.year[1]}&rating.kp=${filters.rating[0]}-${filters.rating[1]}&sortField[]=year&sortType[]=${filters.sortByRelease}&limit=40&page=${page}&field=poster&search=!null&countries.name=!Корея Южная&countries.name=!Китай&countries.name=!Таиланд&countries.name=!Индия&countries.name=!Япония&countries.name=!Тайвань&countries.name=!Турция`) */
        /* return instance.get(`movie?field[]=genres.name&search[]=драма&field[]=year&search[]=${filters.year}&field=rating.kp&search[]=${filters.rating}&field[]=typeNumber&search[]=1&field[]=votes.kp&search[]=!null&sortField[]=year&sortType[]=${filters.sortByRelease}&limit=30&page=${page}&field=poster&search=!null&token=${TOKEN}`) */
        /* return instance.get(`movie?${filters.genre}&search[]=${filters.year}&field[]=year&search[]=${filters.rating}&field=rating.kp&search=!null&field=name&search=1&field=typeNumber&search=!null&field=votes.kp&sortField=year&sortType=${filters.sortByRelease}&limit=30&page=${page}&token=${TOKEN}`) */
        .then(response =>{
            return response;
        })
    },
    
} 

/* 
   https://api.kinopoisk.dev/movie?field[]=genres.name&search[]=драма&field[]=year&search[]=1960-2022&field=rating.kp&search[]=1-10&field=typeNumber&search=1&field=votes.kp&search=!null&sortField=year&sortType=-1&limit=30&page=1&token=XR49Z74-EYEMXHC-K3763BK-VPTYA9M
   https://api.kinopoisk.dev/movie?field[]=genres.name&search[]=драма&field[]=year&search[]=1960-2022&field=rating.kp&search[]=1-10&field[]=typeNumber&search[]=1&field[]=votes.kp&search[]=!null&sortField[]=year&sortType[]=-1&limit=30&page=1&token=XR49Z74-EYEMXHC-K3763BK-VPTYA9M 
   https://api.kinopoisk.dev/movie?field[]=genres.name&search[]=драма&field[]=year&search[]=1960-2022&field=rating.kp&search[]=5-10&limit=30&page=1&token=XR49Z74-EYEMXHC-K3763BK-VPTYA9M

   */
