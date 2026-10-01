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
            // страховка: одна и та же карточка не должна попасть в список дважды
            const seen = new Set(state.films.map((film: any) => film.id));
            state.films = state.films.concat(
                action.payload.filter((film: any) => !seen.has(film.id))
            );
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
            
            // Дозагрузку не сверяем с подписью: у TMDB пагинация по дате
            // нестабильна, страницы перекрываются, и проверка выбрасывала
            // годные ответы. От дублей защищает дедупликация ниже.
            dispatch(addFilms(response.data.docs))
            dispatch(setLoading(false))
            console.log(response)
    })
    .catch((error: any) => {
        console.warn("[студии] запрос не выполнен:", error?.message || error)
        // важно: снимаем лоадер, иначе скелетоны останутся навсегда
        dispatch(setLoading(false))
    });
    }
}

export const getAllFilmsFiltersThunk = (filters: initialStateFiltersStudioType, page: any, nameStudio: any) =>{
    return (dispatch: any) => {

        dispatch(setLoadingFilters(true))
        const requestId = ++latestRequest;
        const signature = makeSignature(filters);
        currentSignature = signature;

        filmsApiV4.getFilmsStudio(filters, page, nameStudio).then((response: any) =>{
            
            // применяем, только если эта выборка всё ещё актуальна:
            // иначе устаревший ответ затрёт список текущих фильтров
            if (currentSignature !== signature) return;

            dispatch(addFilmsNewFilters(response.data.docs))
            dispatch(setLoadingFilters(false))
            console.log(response)
    })
    .catch((error: any) => {
        console.warn("[студии] запрос не выполнен:", error?.message || error)
        dispatch(setLoadingFilters(false))
     });
    }
}

export default allFilmsStudio.reducer;