import React, { useEffect } from 'react';
import { allGenres } from '../../data/allGenres';
import Button from '../Button';
import CheckBox from '../CheckBox';
import SliderValue from '../SliderValue';
import { ButtonWrapper, Wrapper, WrapperAllInputs, WrapperCheckbox, WrapperInput } from '../../app/styles/Filters.styles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { CountryType, initialStateFiltersStudioType, setFilters } from '@/redux/filtersStudios';
import { getAllFilmsFiltersThunk, setPage } from '@/redux/allFilmsStudio';
import { useRouter } from 'next/navigation';
import { FiltersStudiosProps } from './FiltersStudios.types';
import MultipleSelectStudio from '../MultipleSelectStudio';
import SelectCountryStudios from '../SelectCountryStudios';



const FiltersStudios: React.FC<FiltersStudiosProps> = ({mobile, setIsOpenSidebar}) =>{

    const filters = useAppSelector((state: { filtersStudios: any; }) => state.filtersStudios);
    const dispatch = useAppDispatch()
    const [valueRating, setValueRating] = React.useState<number[]>(filters.rating);
    const [nameStudio, setNameStudio] = React.useState<string>(filters.nameStudio);
    const [valueYear, setValueYear] = React.useState<number[]>(filters.year);
    const [valueGenre, setValueGenre] = React.useState<string[]>(filters.genres);
    const [valueCountry, setValueCountry] = React.useState<CountryType[]>(filters.country);
    const [typeOfMovies, setTypeOfMovies] = React.useState(filters.typeOfMovies);
    const [selectedTypeOfMovies, setSelectedTypeOfMovies] = React.useState(filters.selectedTypeOfMovies);
    const router = useRouter();
    const changeFilters = () => {
        const createfilters: initialStateFiltersStudioType ={
            genres: valueGenre,
            rating: valueRating,
            sortByRelease: filters.sortByRelease,
            year: valueYear,
            typeOfMovies: typeOfMovies,
            selectedTypeOfMovies: selectedTypeOfMovies,
            country: valueCountry,
        }
        dispatch(setFilters(createfilters))
        dispatch(setPage(1))
        dispatch(getAllFilmsFiltersThunk(createfilters, 1, nameStudio));
        if(mobile){
          setIsOpenSidebar(false)
        }
        
    }
console.log(filters.genre, valueGenre)
    const changeValueRating:any = (e: any) => {
        setValueRating(e)
    }

    const changeValueYear:any = (e: any) => {
        setValueYear(e)
    }

    const changeIncludedTypeOfMovies = (typeNumber: string) => {
        let newTypeOfMovies = typeOfMovies.map((item: { typeNumber: string; included: any; }) => {
              if (item.typeNumber === typeNumber) {
                return {
                  ...item,
                  included: !item.included
                };
              }
              return item;
            });
        const typeArray = newTypeOfMovies.filter((item: { included: any; }) => item.included).map((item: { typeNumber: any; }) => item.typeNumber);
        setTypeOfMovies(newTypeOfMovies)
        setSelectedTypeOfMovies(typeArray)
      };

    return (
    <Wrapper mobile={(+mobile)}>
        <WrapperAllInputs>
        <WrapperCheckbox>
        {typeOfMovies.map((item: { included: any; typeNumber: string; name: any; }, index: any) => (
        <CheckBox
            checked={item.included}
            id={item.typeNumber}
            label={item.name}
            name={item.name}
            onChange={(e: any) => changeIncludedTypeOfMovies(item.typeNumber)}
            key={item.typeNumber}
        />
        ))}
        </WrapperCheckbox>
            <SliderValue
                title='Рейтинг'
                integer={false}
                min={1}
                max={10}
                step={0.1}
                defaulFirstValue={filters.rating[0]}
                defaulSecondValue={filters.rating[1]}
                onChangeValue={changeValueRating}
            />
            <SliderValue
                title='Год'
                integer={true}
                min={1960}
                max={2024}
                step={1}
                defaulFirstValue={filters.year[0]}
                defaulSecondValue={filters.year[1]}
                onChangeValue={changeValueYear}
            />
            <WrapperInput>
                <p style={{paddingBottom: "14px"}}>Жанры</p>
                <MultipleSelectStudio options={allGenres} onChange={setValueGenre}/>
                <p style={{paddingBottom: "14px", marginTop:'20px'}}>Страны</p>
                <SelectCountryStudios onChange={setValueCountry}/>
            </WrapperInput>
         </WrapperAllInputs>
         <ButtonWrapper>
            <Button onClick={changeFilters}>Применить&nbsp;фильтры</Button>
         </ButtonWrapper>
         
    </Wrapper>
)
}

export default FiltersStudios;