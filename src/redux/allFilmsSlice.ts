import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { filmsApi } from '../api/api';
import { ArrayFilmsType, FilmsType } from '../types/FilmsType';
import { initialStateFiltersType } from './filtersSlice';
import { setLoading } from './Loading';

type initialStateType ={
    films: Array<FilmsType>
    page: number
}

const initialState: initialStateType ={
    films: [],
    page: 1,
}

const allFilms = createSlice({
    name: 'allFilms',
    initialState,
    reducers: {
        
        addFilms(state, action:PayloadAction<ArrayFilmsType>) {
            state.films = state.films.concat(action.payload);
        },
        addFilmsNewFilters(state, action:PayloadAction<ArrayFilmsType>) {
            state.films = action.payload;
        },
        clearFilms(state) {
            state.films = [];
        },
        nextPage(state) {
            state.page = state.page + 1
        },
        setPage(state, action:PayloadAction<number>) {
            state.page = action.payload
        },
    },
});

export const {addFilms, nextPage, setPage, clearFilms, addFilmsNewFilters} = allFilms.actions;


export const getAllFilmsThunk = (filters: initialStateFiltersType, page: any) =>{
    return (dispatch: any) => {

        dispatch(setLoading(true))
        filmsApi.getFilms(filters, page).then((response: any) =>{
            
            dispatch(addFilms(response.data.docs))
            dispatch(setLoading(false))
    })
    }
}

export const getAllFilmsFiltersThunk = (filters: initialStateFiltersType, page: any) =>{
    return (dispatch: any) => {

        dispatch(setLoading(true))
        filmsApi.getFilms(filters, page).then((response: any) =>{
            
            dispatch(addFilmsNewFilters(response.data.docs))
            dispatch(setLoading(false))
    })
    }
}

export default allFilms.reducer;