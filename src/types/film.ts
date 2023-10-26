
type trailersType = {
    _id: string
    url: string
    name: string
    site: string
} 

type posterType = {
    _id: string,
    url: string
    previewUrl: string
    }

type factsType = {
    value: string
    type: string
    spoiler: boolean
    }

type namesType = {
    name: string
    }

type genresType = {
    name: string
    }


type personsType = {
        id: number
        name: string
        enName: string
        description: null | string
        enProfession: string
        photo: string
        
    }

type ProductionCompaniesType ={
    name: string
    url: string
    previewUrl: string
    
}

type SequelsAndPrequelsType ={
    _id: string
    id: number,
    name: string
    enName: string
    alternativeName: string
    type: string
    poster: posterType
    }
    

export type FilmInfoType = {
    externalId: {
    _id : string
    imdb: null | string
    },
    logo: {
    _id: string
    url: null
    },
    poster: posterType
    backdrop: {
    _id: string
    url: string | null
    },
    rating: {
    _id: string
    kp: number
    imdb: number
    filmCritics: number
    russianFilmCritics: number
    await: number
    },
    votes: {
    _id: string
    kp: number,
    imdb: number,
    filmCritics: number,
    russianFilmCritics: number,
    await: number
    },
    videos: {
    _id: string,
    trailers: Array<trailersType>
    teasers: []
    },
    networks: string | null,
    budget: {
    _id: string
    value: number
    currency: string
    },
    fees: {
        world: {
        _id: string
        value: number
        currency: string
        },
        russia: {
        _id: string
        value?: number
        currency?: string
        },
        usa: {
        _id: string
        value?: number
        currency?: string
        },
        _id: string
    },
    distributors: {
    distributor: string
    distributorRelease: null | string
    },
    premiere: {
    _id: string
    country: string
    world: string
    },
    images: {
    postersCount: number
    backdropsCount: number
    framesCount: number
    },
    collections: []
    updateDates: Array<string>
    id: number
    type: string
    name: string
    description: string
    slogan: null | string
    year: number
    facts: Array<factsType>
    genres: Array<genresType>
    countries: Array<namesType>
    seasonsInfo: Array<any>
    persons: Array<personsType>
    lists: Array<any>
    productionCompanies: Array<ProductionCompaniesType>
    typeNumber: number
    alternativeName: string
    enName: null | string
    movieLength: number | null
    names: Array<namesType>
    status: string
    subType: null | string,
    ratingMpaa: string
    shortDescription: null | string
    technology: {
    _id: string
    hasImax: boolean
    has3D: boolean
    },
    ticketsOnSale: boolean
    updatedAt: string
    imagesInfo: {
    _id: string
    framesCount: number
    },
    sequelsAndPrequels: Array<SequelsAndPrequelsType>
    similarMovies: []
    ageRating: number
    watchability: {
    _id: string
    items: null
    },
    createDate: string
    }