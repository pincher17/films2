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

// защита от гонки запросов
// Если пришло два ответа подряд (например, пользователь быстро сменил
// сортировку или фильтр), применяем только последний: иначе старые карточки
// дописываются к новым и список перемешивается.
let latestRequest = 0;
// подпись текущей выборки: если фильтры сменились, дописывать чужие страницы нельзя
let currentSignature = "";

const makeSignature = (filters: any) =>
  JSON.stringify([
    filters?.sortBy,
    filters?.sortByRelease,
    filters?.country,
    filters?.year,
    filters?.rating,
    filters?.selectedTypeOfMovies,
    filters?.genres,
    filters?.genre,
  ]);

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
        const requestId = ++latestRequest;
        const signature = makeSignature(filters);

        filmsApiV4.getFilmsStudio(filters, page, nameStudio).then((response: any) =>{
            
            // применяем только самый свежий запрос той же выборки
            if (requestId !== latestRequest) return;
            if (signature !== currentSignature) return;

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
        const requestId = ++latestRequest;
        currentSignature = makeSignature(filters);

        filmsApiV4.getFilmsStudio(filters, page, nameStudio).then((response: any) =>{
            
            // применяем только самый свежий запрос
            if (requestId !== latestRequest) return;
            
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