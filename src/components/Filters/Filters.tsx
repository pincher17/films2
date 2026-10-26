import React, { useEffect } from 'react';
import { allGenres } from '../../data/allGenres';
import Button from '../Button';
import { ResetButton } from '../../app/styles/AllFilmsPage.styles';
import CheckBox from '../CheckBox';
import MultipleSelect from '../MultipleSelect';
import SliderValue from '../SliderValue';
import { ButtonWrapper, FilterPill, FiltersActions, PillBox, Wrapper, WrapperAllInputs, WrapperCheckbox, WrapperInput } from '../../app/styles/Filters.styles';
import { FiltersProps } from './Filters.types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { CountryType, initialStateFiltersType, setFilters } from '@/redux/filtersSlice';
import { getAllFilmsFiltersThunk, setPage } from '@/redux/allFilmsSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import SelectCountry from '../SelectCountry/SelectCountry';
import SortSelect from '../SortSelect/SortSelect';



const Filters: React.FC<FiltersProps & { hideTypes?: boolean }> = ({mobile, setIsOpenSidebar, hideTypes}) =>{

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

        /*
         * Значения фильтров приходят в разном виде: строки, объекты {value,label},
         * иногда вложенные объекты. Берём только то, что можно положить в адрес,
         * и никогда не роняем страницу из-за неожиданного типа.
         */
        const toList = (value: unknown): any[] =>
            Array.isArray(value) ? value : value ? [value] : [];

        const toText = (item: any): string | null => {
            if (typeof item === "string" && item.trim()) return item;
            if (item && typeof item === "object") {
                if (typeof item.value === "string" && item.value.trim()) return item.value;
                if (typeof item.label === "string" && item.label.trim()) return item.label;
                if (typeof item.name === "string" && item.name.trim()) return item.name;
                if (typeof item.typeNumber === "string") return item.typeNumber;
            }
            return null;
        };

        const genre = toList(f.genre).map(toText).filter(Boolean);
        const country = toList(f.country).map(toText).filter(Boolean);
        const types = toList(f.selectedTypeOfMovies).map(toText).filter(Boolean);

        if (genre.length) params.set('genre', genre.join(','));
        /*
         * Страну в адрес НЕ пишем: в состоянии фильтров она хранится как готовый
         * фрагмент запроса («&countries.name=Беларусь&countries.name=Казахстан…»),
         * и в адресной строке это превращалось в мусор, а после восстановления
         * ломало выборку — каталог отдавал пустой результат.
         */
        if (types.length) params.set('types', types.join(','));
        if (f.year?.length) params.set('year', f.year.join('-'));
        if (f.rating?.length) params.set('rating', f.rating.join('-'));
        if (f.sortBy) params.set('sort', f.sortBy);

        const query = params.toString();
        return query ? `/films?${query}` : '/films';
    };

    /**
     * Сброс фильтров: очищаем адрес и перезагружаем страницу. Полная
     * перезагрузка надёжнее ручного сброса состояния: сбрасываются и ползунки,
     * и плитки типов, и все поля — состояние берётся из чистого адреса.
     */
    const resetFilters = () => {
        router.replace('/films');
        window.location.href = '/films';
    };

    /*
     * Синхронизация с хранилищем. Панель инициализирует свои поля один раз при
     * монтировании, а фильтры из адреса приходят в хранилище позже — из-за этого
     * жанры и типы не подтягивались при обновлении страницы.
     */
    React.useEffect(() => {
        setValueGenre(filters.genre || []);
        setValueCountry(filters.country || []);
        setValueYear(filters.year || [1960, 2026]);
        setValueRating(filters.rating || [1, 10]);
        setValueSort(filters.sortBy || 'date-desc');
        if (filters.typeOfMovies?.length) {
            setTypeOfMovies(filters.typeOfMovies);
        }
        setSelectedTypeOfMovies(filters.selectedTypeOfMovies || []);
    }, [filters]);

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
        router.replace('/films');
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
        {/* Блок галочек нужен только там, где тип не задан разделом.
            Раньше он оставался в разметке пустым и занимал первую колонку,
            из-за чего фильтры съезжали вправо. */}
        {!hideTypes && (
        <WrapperCheckbox>
        {typeOfMovies.map((item: { included: any; typeNumber: string; name: any; }, index: number) => (
        <FilterPill $active={item.included} key={item.typeNumber} htmlFor={`type-${item.typeNumber}`}>
            <input
                id={`type-${item.typeNumber}`}
                type="checkbox"
                checked={item.included}
                onChange={() => changeIncludedTypeOfMovies(item.typeNumber)}
            />
            <PillBox $active={item.included}>
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.4l3 3L10 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </PillBox>
            {item.name}
        </FilterPill>
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
            <FiltersActions>
                <Button onClick={changeFilters}>Применить&nbsp;фильтры</Button>
                <ResetButton onClick={resetFilters}>Сбросить</ResetButton>
            </FiltersActions>
         </ButtonWrapper>
         
    </Wrapper>
)
}

export default Filters;