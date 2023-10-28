import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType ={
    loading: boolean
    loadingFilters: boolean
}

const initialState: initialStateType ={
    loading: false,
    loadingFilters: false
}

const loading = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading(state, action:PayloadAction<boolean>) {
            state.loading = action.payload
        },
        setLoadingFilters(state, action:PayloadAction<boolean>) {
            state.loadingFilters = action.payload
        },
    },
});

export const {setLoading, setLoadingFilters} = loading.actions;



export default loading.reducer;