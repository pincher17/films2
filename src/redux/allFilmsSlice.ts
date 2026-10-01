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
            
            // применяем только самый свежий запрос той же выборки
            if (requestId !== latestRequest) return;
            if (signature !== currentSignature) {
              console.log("[filmhub] список: отбросил дозагрузку — другая выборка", { page });
              return;
            }

            console.log("[filmhub] список: дописал", {
              page,
              пришло: response.data.docs.length,
              первый: response.data.docs[0]?.name,
              год: response.data.docs[0]?.year,
            });
            dispatch(addFilms(response.data.docs))
            dispatch(setLoading(false))
            /* console.log(response) */
    })
    .catch((error: any) => {
       /* console.log(error) */
        
    });
    }
}

export const getAllFilmsFiltersThunk = (filters: initialStateFiltersType, page: any, genre: any = []) =>{
    return (dispatch: any) => {

        dispatch(setLoadingFilters(true))
        const requestId = ++latestRequest;
        currentSignature = makeSignature(filters);
        console.log("[filmhub] список: новый запрос", {
          page,
          sort: (filters as any)?.sortBy,
          country: (filters as any)?.country?.[0]?.value ?? (filters as any)?.country,
        });

        filmsApiV4.getFilms(filters, page, genre).then((response: any) =>{
            
            // применяем только самый свежий запрос
            if (requestId !== latestRequest) return;
            
            console.log("[filmhub] список: заменил", {
              page,
              пришло: response.data.docs.length,
              первый: response.data.docs[0]?.name,
              год: response.data.docs[0]?.year,
            });
            dispatch(addFilmsNewFilters(response.data.docs))
            dispatch(setLoadingFilters(false))
            /* console.log(response) */
    })
    .catch((error: any) => {
        /* console.log(error) */
         
     });
    }
}

export default allFilms.reducer;