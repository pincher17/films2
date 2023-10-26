import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType ={
    loading: boolean
}

const initialState: initialStateType ={
    loading: false
}

const loading = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        setLoading(state, action:PayloadAction<boolean>) {
            state.loading = action.payload
        },
    },
});

export const {setLoading} = loading.actions;



export default loading.reducer;