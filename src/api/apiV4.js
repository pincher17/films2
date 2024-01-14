import axios from "axios";


export const instance = axios.create({
    baseURL: 'https://api.kinopoisk.dev/v1.4/',
    headers: {
        'accept': 'application/json',
        'X-API-KEY': 'XR49Z74-EYEMXHC-K3763BK-VPTYA9M',
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
}
