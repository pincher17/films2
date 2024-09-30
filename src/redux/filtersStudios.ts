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


export type initialStateFiltersStudioType ={
     year: number[]
     rating: number[]
     sortByRelease: string
     genres: any[]
     typeOfMovies: MovieType[]
     selectedTypeOfMovies: string[]
     country: CountryType[]
     nameStudio?: string
    }


const initialState: initialStateFiltersStudioType ={
        nameStudio: '',
        year: [1960, 2024],
        rating: [1, 10],
        sortByRelease: '-1',
        genres: [],
        typeOfMovies: [
            {name: 'Фильмы', included: true, typeNumber: '1'},
            {name: 'Сериалы', included: true, typeNumber: '2'},
            {name: 'Мультфильмы', included: true, typeNumber: '3'},
        ],
        selectedTypeOfMovies: ['1','2','3'],
        country: [  { value: '', label: 'Все', id: 1 }],   
}

const filtersStudios = createSlice({
    name: 'filtersStudios',
    initialState,
    reducers: {
        setNameStudio(state, action:PayloadAction<string>) {
            state.nameStudio = action.payload
        },
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
            state.genres = action.payload
        },
        setFilters(state, action:PayloadAction<initialStateFiltersStudioType>) {
           /*  state.nameStudio = action.payload.nameStudio */
            state.year = action.payload.year
            state.rating = action.payload.rating
            state.sortByRelease = action.payload.sortByRelease
            state.genres = action.payload.genres
            state.typeOfMovies = action.payload.typeOfMovies
            state.selectedTypeOfMovies = action.payload.selectedTypeOfMovies
            state.country = action.payload.country
        },
    },
});

export const {setFilterYear, setFilterRating, setFilterRelease,
                setFilterGenre, setFilters, setNameStudio} = filtersStudios.actions;




export default filtersStudios.reducer;