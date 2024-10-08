import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MovieType = {
    name: string;
    included: boolean;
    typeNumber: string;
  };

  export type CountryType = {
    value: string;
    label: string;
    id: number;
  };


export type initialStateFiltersType ={
     year: number[]
     rating: number[]
     sortByRelease: string
     genre: any[]
     typeOfMovies: MovieType[]
     selectedTypeOfMovies: string[]
     updateGenre: boolean
     country: CountryType[]
    }


const initialState: initialStateFiltersType ={
        year: [1960, 2024],
        rating: [1, 10],
        sortByRelease: '-1',
        genre: [],
        typeOfMovies: [
            {name: 'Фильмы', included: true, typeNumber: '1'},
            {name: 'Сериалы', included: true, typeNumber: '2'},
            {name: 'Мультфильмы', included: true, typeNumber: '3'},
        ],
        selectedTypeOfMovies: ['1','2','3'],
        updateGenre: false,
        country: [  { value: '', label: 'Все', id: 1 }],   
}

const filters = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilterYear(state, action:PayloadAction<number[]>) {
            state.year = action.payload
        },
        setFilterRating(state, action:PayloadAction<number[]>) {
            state.rating = action.payload
        },
        setFilterRelease(state, action:PayloadAction<string>) {
            state.sortByRelease = action.payload
        },
        setFilterGenre(state, action:PayloadAction<Array<any>>) {
            state.genre = action.payload
        },
        setFilters(state, action:PayloadAction<initialStateFiltersType>) {
            state.year = action.payload.year
            state.rating = action.payload.rating
            state.sortByRelease = action.payload.sortByRelease
            state.genre = action.payload.genre
            state.typeOfMovies = action.payload.typeOfMovies
            state.selectedTypeOfMovies = action.payload.selectedTypeOfMovies
            state.country = action.payload.country
        },
        setUpdateGenre(state, action:PayloadAction<boolean>) {
            state.updateGenre = action.payload
        },
    },
});

export const {setFilterYear, setFilterRating, setFilterRelease,
                setFilterGenre, setFilters, setUpdateGenre} = filters.actions;




export default filters.reducer;