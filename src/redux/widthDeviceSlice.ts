import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type initialStateType ={
    width: number
}

const initialState: initialStateType ={
    width: 0,
}

const widthDevice = createSlice({
    name: 'widthDevice',
    initialState,
    reducers: {
        setWidthDevice(state, action:PayloadAction<number>) {
            state.width = action.payload
        }
    },
});

export const {setWidthDevice} = widthDevice.actions;



export default widthDevice.reducer;