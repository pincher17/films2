import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { filmsApi } from '../api/api';
import { ArrayFilmsType, FilmsType } from '../types/FilmsType';
import { setLoading } from './Loading';

type initialStateType ={
    top10: Array<FilmsType>
    thriller: Array<FilmsType>
    comedy: Array<FilmsType>
    drama: Array<FilmsType>
    detective: Array<FilmsType>
    boevik: Array<FilmsType>
    films: Array<FilmsType>
    series: Array<FilmsType>
    isVisible: boolean
}

const initialState: initialStateType ={
    top10: [],
    thriller: [],
    comedy: [],
    drama: [],
    detective: [],
    boevik: [],
    films: [],
    series: [],
    isVisible: false,
}

const filmsMainPage = createSlice({
    name: 'filmsMainPage',
    initialState,
    reducers: {
        addTop10(state, action:PayloadAction<ArrayFilmsType>) {
            state.top10 = action.payload
        },
        addThriller(state, action:PayloadAction<ArrayFilmsType>) {
            state.thriller = action.payload
        },
        addComedy(state, action:PayloadAction<ArrayFilmsType>) {
            state.comedy = action.payload
        },
        addDrama(state, action:PayloadAction<ArrayFilmsType>) {
            state.drama = action.payload
        },
        addBoevik(state, action:PayloadAction<ArrayFilmsType>) {
            state.boevik = action.payload
        },
        addFilms(state, action:PayloadAction<ArrayFilmsType>) {
            state.films = action.payload
        },
        addSeries(state, action:PayloadAction<ArrayFilmsType>) {
            state.series = action.payload
        },
        setIsVisible(state, action:PayloadAction<boolean>) {
            state.isVisible = action.payload
        },
    },
});

export const {addFilms, addBoevik, addComedy, addDrama, addSeries, addThriller, addTop10, setIsVisible} = filmsMainPage.actions;


export const getFilmsThunk = () =>{
    return (dispatch: any) => {

        dispatch(setLoading(true))
        filmsApi.getFilmsMainPage().then((response: any) =>{
            dispatch(addFilms(response.data.docs))
            dispatch(setLoading(false))
    })
    }
}

export const getFilmsTop10 = () =>{
    return (dispatch: any) => {

        dispatch(setLoading(true))
        filmsApi.getFilmsTop10().then((response: any) =>{
            dispatch(addTop10(response.data.docs))
            dispatch(setLoading(false))
    })
    }
}

export const getThriller = () =>{
    return (dispatch: any) => {

        dispatch(setLoading(true))
        filmsApi.getFilmsThrillerMainPage().then((response: any) =>{
            dispatch(addThriller(response.data.docs))
            dispatch(setLoading(false))
    })
    }
}

export const getComedy = () =>{
    return (dispatch: any) => {

        dispatch(setLoading(true))
        filmsApi.getFilmsComedyMainPage().then((response: any) =>{
            dispatch(addComedy(response.data.docs))
            dispatch(setLoading(false))
    })
    }
}

export const getDrama = () =>{
    return (dispatch: any) => {

        dispatch(setLoading(true))
        filmsApi.getFilmsDramaMainPage().then((response: any) =>{
            dispatch(addDrama(response.data.docs))
            dispatch(setLoading(false))
    })
    }
}

export const getBoevik = () =>{
    return (dispatch: any) => {

        dispatch(setLoading(true))
        filmsApi.getFilmsBoevikMainPage().then((response: any) =>{
            dispatch(addBoevik(response.data.docs))
            dispatch(setLoading(false))
    })
    }
}

export const getSeries = () =>{
    return (dispatch: any) => {

        dispatch(setLoading(true))
        filmsApi.getSeriesMainPage().then((response: any) =>{
            dispatch(addSeries(response.data.docs))
            dispatch(setLoading(false))
    })
    }
}


export default filmsMainPage.reducer;