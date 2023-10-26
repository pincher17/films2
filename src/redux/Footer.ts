import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType ={
    ShowFooter: boolean
}

const initialState: initialStateType ={
    ShowFooter: true,
}

const footer = createSlice({
    name: 'footer',
    initialState,
    reducers: {
        setShowFooter(state, action:PayloadAction<boolean>) {
            state.ShowFooter = action.payload
        },
    },
});

export const {setShowFooter} = footer.actions;



export default footer.reducer;