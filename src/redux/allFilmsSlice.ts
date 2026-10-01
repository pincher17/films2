import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { filmsApi } from '../api/api';
import { ArrayFilmsType, FilmsType } from '../types/FilmsType';
import { initialStateFiltersType } from './filtersSlice';
import { setLoading, setLoadingFilters } from './Loading';
import { filmsApiV4 } from '../api/apiV4';

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
        const requestId = ++latestRequest;
        const signature = makeSignature(filters);

        filmsApiV4.getFilms(filters, page).then((response: any) =>{
            
            // дозагрузка применяется только к своей выборке
            if (signature !== currentSignature) return;
            dispatch(addFilms(response.data.docs))
            dispatch(setLoading(false))
            /* console.log(response) */
    })
    .catch((error: any) => {
        console.warn("[список] запрос не выполнен:", error?.message || error)
        // важно: снимаем лоадер, иначе скелетоны останутся навсегда
        dispatch(setLoading(false))
    });
    }
}

export const getAllFilmsFiltersThunk = (filters: initialStateFiltersType, page: any, genre: any = []) =>{
    return (dispatch: any) => {

        dispatch(setLoadingFilters(true))
        const requestId = ++latestRequest;
        const signature = makeSignature(filters);
        currentSignature = signature;

        filmsApiV4.getFilms(filters, page, genre).then((response: any) =>{
            
            // применяем, только если эта выборка всё ещё актуальна:
            // иначе устаревший ответ затрёт список текущих фильтров
            if (currentSignature !== signature) return;

            dispatch(addFilmsNewFilters(response.data.docs))
            dispatch(setLoadingFilters(false))
            /* console.log(response) */
    })
    .catch((error: any) => {
        console.warn("[список] запрос не выполнен:", error?.message || error)
        dispatch(setLoadingFilters(false))
     });
    }
}

export default allFilms.reducer;