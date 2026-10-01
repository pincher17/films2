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
            // страховка: одна и та же карточка не должна попасть в список дважды
            const seen = new Set(state.films.map((film: any) => film.id));
            const fresh = action.payload.filter((film: any) => !seen.has(film.id));
            console.log("[fh] дозагрузка: пришло", action.payload.length, "| новых", fresh.length, "| стало", state.films.length + fresh.length);
            state.films = state.films.concat(fresh);
        },
        addFilmsNewFilters(state, action:PayloadAction<ArrayFilmsType>) {
            console.log("[fh] список заменён:", action.payload.length, "карточек");
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
            
            // Дозагрузку не сверяем с подписью: у TMDB пагинация по дате
            // нестабильна, страницы перекрываются, и проверка выбрасывала
            // годные ответы. От дублей защищает дедупликация ниже.
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
            if (currentSignature !== signature) {
              // снимаем флаг: если оставить его включённым, лента выключится навсегда
              dispatch(setLoadingFilters(false));
              return;
            }

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