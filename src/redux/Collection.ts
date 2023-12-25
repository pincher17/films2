import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ArrayFilmsType, FilmsType } from '../types/FilmsType';
import { initialStateFiltersType } from './filtersSlice';
import { setLoading, setLoadingFilters } from './Loading';
import { filmsApiV4 } from '@/api/apiV4';

type initialStateType ={
    nameCollection: string,
    films: Array<FilmsType>
    page: number
    allPages: number
    nameCollectionRussian: string
}

const initialState: initialStateType ={
    nameCollection: '',
    films: [],
    page: 1,
    allPages: 0,
    nameCollectionRussian: '',
}

const collection = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        
        addFilms(state, action:PayloadAction<ArrayFilmsType>) {
            state.films = state.films.concat(action.payload);
        },
        addFilmsNew(state, action:PayloadAction<ArrayFilmsType>) {
            state.films = action.payload;
        },
        setAllPages(state, action:PayloadAction<number>) {
            state.allPages = action.payload;
        },
        nextPage(state) {
            state.page = state.page + 1
        },
        setPage(state, action:PayloadAction<number>) {
            state.page = action.payload
        },
        setNameCollection(state, action:PayloadAction<string>) {
            state.nameCollection = action.payload
        },
        setNameCollectionRussian(state, action:PayloadAction<string>) {
            state.nameCollectionRussian = action.payload
        },
    },
});

export const {addFilms, nextPage, setPage, setAllPages, addFilmsNew, setNameCollection, setNameCollectionRussian} = collection.actions;


export const getFilmsSlugThunk = (slug: string, page: any) =>{
    return (dispatch: any) => {

        dispatch(setLoading(true))
        filmsApiV4.getFilmsSlug(slug, page).then((response: any) =>{
            
            dispatch(addFilms(response.data.docs))
            dispatch(setLoading(false))
    })
    }
}

export const getFilmsSlugFirstThunk = (slug: string, page: any) =>{
    return (dispatch: any) => {

        dispatch(setLoadingFilters(true))
        filmsApiV4.getFilmsSlug(slug, page).then((response: any) =>{
            
            dispatch(addFilmsNew(response.data.docs))
            dispatch(setAllPages(response.data.pages))
            dispatch(setLoadingFilters(false))
    })
    filmsApiV4.getInfoSlug(slug).then((response: any) =>{
            
        dispatch(setNameCollectionRussian(response.data.name))
})
    }
}


export default collection.reducer;