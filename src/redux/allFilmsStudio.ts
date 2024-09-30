import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { filmsApi } from '../api/api';
import { ArrayFilmsType, FilmsType } from '../types/FilmsType';
import { setLoading, setLoadingFilters } from './Loading';
import { filmsApiV4 } from '../api/apiV4';
import { initialStateFiltersStudioType } from './filtersStudios';

type initialStateType ={
    films: Array<FilmsType>
    page: number
}

const initialState: initialStateType ={
    films: [],
    page: 1,
}

const allFilmsStudio = createSlice({
    name: 'allFilmsStudio',
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

export const {addFilms, nextPage, setPage, clearFilms, addFilmsNewFilters} = allFilmsStudio.actions;


export const getAllFilmsThunk = (filters: initialStateFiltersStudioType, page: any, nameStudio: any) =>{
    return (dispatch: any) => {

        dispatch(setLoading(true))
        filmsApiV4.getFilmsStudio(filters, page, nameStudio).then((response: any) =>{
            
            dispatch(addFilms(response.data.docs))
            dispatch(setLoading(false))
            console.log(response)
    })
    .catch((error: any) => {
       console.log(error)
        
    });
    }
}

export const getAllFilmsFiltersThunk = (filters: initialStateFiltersStudioType, page: any, nameStudio: any) =>{
    return (dispatch: any) => {

        dispatch(setLoadingFilters(true))
        filmsApiV4.getFilmsStudio(filters, page, nameStudio).then((response: any) =>{
            
            dispatch(addFilmsNewFilters(response.data.docs))
            dispatch(setLoadingFilters(false))
            console.log(response)
    })
    .catch((error: any) => {
        console.log(error)
         
     });
    }
}

export default allFilmsStudio.reducer;