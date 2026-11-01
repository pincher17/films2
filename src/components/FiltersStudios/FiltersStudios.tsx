import React, { useEffect } from 'react';
import { allGenres } from '../../data/allGenres';
import Button from '../Button';
import { ResetButton } from '../../app/styles/AllFilmsPage.styles';
import CheckBox from '../CheckBox';
import SliderValue from '../SliderValue';
import { ButtonWrapper, Wrapper, WrapperAllInputs, WrapperCheckbox, WrapperInput, Field, FiltersActions, FiltersStudiosPanel } from '../../app/styles/Filters.styles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { CountryType, initialStateFiltersStudioType, setFilters } from '@/redux/filtersStudios';
import { getAllFilmsFiltersThunk, setPage } from '@/redux/allFilmsStudio';
import { useRouter } from 'next/navigation';
import { FiltersStudiosProps } from './FiltersStudios.types';
import MultipleSelectStudio from '../MultipleSelectStudio';
import SelectCountryStudios from '../SelectCountryStudios';
import SortSelect from '../SortSelect/SortSelect';



const FiltersStudios: React.FC<FiltersStudiosProps> = ({mobile, setIsOpenSidebar, hideTypes, genres}) =>{

    const filters = useAppSelector((state: { filtersStudios: any; }) => state.filtersStudios);
    const dispatch = useAppDispatch()
    const [valueRating, setValueRating] = React.useState<number[]>(filters.rating);
    const [nameStudio, setNameStudio] = React.useState<string>(filters.nameStudio);
    const [valueYear, setValueYear] = React.useState<number[]>(filters.year);
    const [valueGenre, setValueGenre] = React.useState<string[]>(filters.genres);
    const [valueCountry, setValueCountry] = React.useState<CountryType[]>(filters.country);
    const [valueSort, setValueSort] = React.useState<string>(filters.sortBy || 'date-desc');
    const [typeOfMovies, setTypeOfMovies] = React.useState(filters.typeOfMovies);
    const [selectedTypeOfMovies, setSelectedTypeOfMovies] = React.useState(filters.selectedTypeOfMovies);
    const router = useRouter();
    /* Сброс: возвращаем стартовые значения и перезагружаем страницу —
       так состояние точно чистое, как в каталоге */
    const resetFilters = () => {
        const fresh: any = {
            genres: [],
            rating: [1, 10],
            sortByRelease: '-1',
            sortBy: 'date-desc',
            year: [1960, 2026],
            selectedTypeOfMovies: ['1'],
        };
        dispatch(setFilters(fresh));
        dispatch(setPage(1));
        dispatch(getAllFilmsFiltersThunk(fresh, 1, nameStudio));
        if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
    };

    const changeFilters = () => {
        const createfilters: initialStateFiltersStudioType ={
            genres: valueGenre,
            rating: valueRating,
            sortByRelease: filters.sortByRelease,
            sortBy: valueSort,
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
        <FiltersStudiosPanel>
        {/* Блок галочек не рендерим, когда тип задан переключателем: иначе
            пустой контейнер занимает первую колонку и поля съезжают */}
        {!hideTypes && (
        <WrapperCheckbox>
        {!hideTypes && typeOfMovies.map((item: { included: any; typeNumber: string; name: any; }, index: any) => (
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
        )}
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
                max={2026}
                step={1}
                defaulFirstValue={filters.year[0]}
                defaulSecondValue={filters.year[1]}
                onChangeValue={changeValueYear}
            />
            {/* Каждое поле — своя ячейка панели, как в каталоге */}
            <Field>
                <p>Жанры</p>
                <MultipleSelectStudio options={genres || allGenres} onChange={setValueGenre}/>
            </Field>
            <Field>
                <p>Сортировка</p>
                <SortSelect onChange={setValueSort} studio/>
            </Field>
         </FiltersStudiosPanel>
         <ButtonWrapper>
            <FiltersActions>
                <Button onClick={changeFilters}>Применить&nbsp;фильтры</Button>
                <ResetButton onClick={resetFilters}>Сбросить</ResetButton>
            </FiltersActions>
         </ButtonWrapper>
         
    </Wrapper>
)
}

export default FiltersStudios;