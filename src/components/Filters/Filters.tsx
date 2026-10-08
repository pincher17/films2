import React, { useEffect } from 'react';
import { allGenres } from '../../data/allGenres';
import Button from '../Button';
import { ResetButton } from '../../app/styles/AllFilmsPage.styles';
import CheckBox from '../CheckBox';
import MultipleSelect from '../MultipleSelect';
import SliderValue from '../SliderValue';
import { ButtonWrapper, Wrapper, WrapperAllInputs, WrapperCheckbox, WrapperInput } from '../../app/styles/Filters.styles';
import { FiltersProps } from './Filters.types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { CountryType, initialStateFiltersType, setFilters } from '@/redux/filtersSlice';
import { getAllFilmsFiltersThunk, setPage } from '@/redux/allFilmsSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import SelectCountry from '../SelectCountry/SelectCountry';
import SortSelect from '../SortSelect/SortSelect';



const Filters: React.FC<FiltersProps> = ({mobile, setIsOpenSidebar}) =>{

    const filters = useAppSelector((state: { filters: any; }) => state.filters);
    const dispatch = useAppDispatch()
    const [valueRating, setValueRating] = React.useState<number[]>(filters.rating);
    const [valueYear, setValueYear] = React.useState<number[]>(filters.year);
    const [valueGenre, setValueGenre] = React.useState<string[]>(filters.genre);
    const [valueCountry, setValueCountry] = React.useState<CountryType[]>(filters.country);
    const [valueSort, setValueSort] = React.useState<string>(filters.sortBy || 'date-desc');
    const [typeOfMovies, setTypeOfMovies] = React.useState(filters.typeOfMovies);
    const [selectedTypeOfMovies, setSelectedTypeOfMovies] = React.useState(filters.selectedTypeOfMovies);
    const router = useRouter();
    /**
     * Фильтры в адресной строке: тогда ссылку можно сохранить, а обновление
     * страницы не сбрасывает выбор. Раньше здесь стоял router.replace('/films'),
     * который параметры стирал.
     */
    const buildQuery = (f: initialStateFiltersType) => {
        const params = new URLSearchParams();
        const genre = (f.genre || []).map((item: any) => item?.value || item).filter(Boolean);
        const country = (f.country || []).map((item: any) => item?.value || item).filter(Boolean);
        const types = (f.selectedTypeOfMovies || [])
            .map((item: any) => item?.typeNumber)
            .filter(Boolean);

        if (genre.length) params.set('genre', genre.join(','));
        if (country.length) params.set('country', country.join(','));
        if (types.length) params.set('types', types.join(','));
        if (f.year?.length) params.set('year', f.year.join('-'));
        if (f.rating?.length) params.set('rating', f.rating.join('-'));
        if (f.sortBy) params.set('sort', f.sortBy);

        const query = params.toString();
        return query ? `/films?${query}` : '/films';
    };

    /** Сброс: возвращаем значения по умолчанию и очищаем адрес */
    const resetFilters = () => {
        router.replace('/films');
        setValueGenre([]);
        setValueCountry([]);
        setValueYear([1960, 2026]);
        setValueRating([1, 10]);
        setValueSort('date-desc');
        const fresh = {
            ...filters,
            genre: [],
            country: [],
            year: [1960, 2026],
            rating: [1, 10],
            sortBy: 'date-desc',
            sortByRelease: '-1',
        };
        dispatch(setFilters(fresh as initialStateFiltersType));
        dispatch(setPage(1));
        dispatch(getAllFilmsFiltersThunk(fresh as initialStateFiltersType, 1));
    };

    const changeFilters = () => {
        const createfilters: initialStateFiltersType ={
            genre: valueGenre,
            rating: valueRating,
            sortByRelease: filters.sortByRelease,
            sortBy: valueSort,
            year: valueYear,
            typeOfMovies: typeOfMovies,
            selectedTypeOfMovies: selectedTypeOfMovies,
            updateGenre: false,
            country: valueCountry,
        }
        router.replace(buildQuery(createfilters));
        dispatch(setFilters(createfilters))
        dispatch(setPage(1))
        dispatch(getAllFilmsFiltersThunk(createfilters, 1));
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
                max={2026}
                step={1}
                defaulFirstValue={filters.year[0]}
                defaulSecondValue={filters.year[1]}
                onChangeValue={changeValueYear}
            />
            <WrapperInput>
                <p style={{paddingBottom: "14px"}}>Жанры</p>
                <MultipleSelect options={allGenres} onChange={setValueGenre}/>
                <p style={{paddingBottom: "14px", marginTop:'20px'}}>Страны</p>
                <SelectCountry onChange={setValueCountry}/>
                <p style={{paddingBottom: "14px", marginTop:'20px'}}>Сортировка</p>
                <SortSelect onChange={setValueSort}/>
            </WrapperInput>
         </WrapperAllInputs>
         <ButtonWrapper>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Button onClick={changeFilters}>Применить&nbsp;фильтры</Button>
                <ResetButton onClick={resetFilters}>Сбросить</ResetButton>
            </div>
         </ButtonWrapper>
         
    </Wrapper>
)
}

export default Filters;