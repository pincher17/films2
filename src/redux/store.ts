import { configureStore } from "@reduxjs/toolkit";
import allFilmsSlice from './allFilmsSlice';
import filmInfo from './filmInfoSlice';
import filtersSlice from './filtersSlice';
import newFilmsReducer from './newFilmsSlice';
import searchSlice from './searchSlice';
import widthDeviceSlice from './widthDeviceSlice';
import Loading from './Loading';
import filmsMainPageSlice from './FilmsMainPageSlice';
import Footer from './Footer';

export const store = configureStore({
  reducer: {
  newFilms: newFilmsReducer,
  filmInfo: filmInfo,
  search: searchSlice,
  filters: filtersSlice,
  allFilms: allFilmsSlice,
  widthDevice: widthDeviceSlice,
  loading: Loading,
  footer: Footer,
  filmsMainPage: filmsMainPageSlice
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
