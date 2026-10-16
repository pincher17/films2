import React from 'react';
import Select from 'react-select';
import { useAppSelector } from '@/redux/hooks';

export const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Сначала новые' },
  { value: 'date-asc', label: 'Сначала старые' },
  { value: 'rating', label: 'По рейтингу' },
];

type Props = { onChange: (value: any) => void; studio?: boolean };

/** Выбор сортировки — тот же вид, что у выбора страны */
const SortSelect: React.FC<Props> = ({ onChange, studio }) => {
  const sortBy = useAppSelector((state: any) =>
    studio ? state.filtersStudios.sortBy : state.filters.sortBy
  );
  const [selected, setSelected] = React.useState<any>(
    SORT_OPTIONS.find((option) => option.value === sortBy) || SORT_OPTIONS[0]
  );

  React.useEffect(() => {
    // наружу уходит строка ('date-asc' | 'rating' | 'date-desc'),
    // иначе в API уезжал объект [object Object] и сортировка не работала
    onChange(selected?.value || 'date-desc');
  }, [selected]);

  const colourStyles = {
  /* Портал меню должен быть выше шторки и затемнения, иначе меню уйдёт под них */
  menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 1500 }) as never,
    control: (base: any, state: any) => ({
      ...base,
      color: 'white',
      background: '#0e0e0e',
      /* было 300px жёстко — на телефоне список вылезал за край экрана */
      width: '100%',
      maxWidth: '100%',
      /* Без минимальной ширины список сжимался на средних экранах:
         колонка фильтров там определяется содержимым, а не шириной. */
      minWidth: '260px',
      borderColor: state.isFocused ? '#747474' : 'rgb(52 52 52)',
      boxShadow: 'none',
      flex: 1,
      cursor: 'pointer',
    }),
    menu: (base: any) => ({ ...base, borderRadius: 0, marginTop: 0 }),
    menuList: (base: any) => ({ ...base, background: '#0e0e0e' }),
    singleValue: (styles: any) => ({ ...styles, color: 'white' }),
    option: (styles: any, { isFocused }: any) => ({
      ...styles,
      backgroundColor: isFocused ? '#494949' : undefined,
      color: 'white',
      cursor: 'pointer',
    }),
  };

  return (
    <Select
      classNamePrefix="fh-select"
      /* Меню рисуем в портале: иначе его обрезает граница прокручиваемой
         области шторки, и нижние варианты недоступны на телефоне. */
      menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
      menuPlacement="auto"
      closeMenuOnSelect={true}
      options={SORT_OPTIONS}
      name="sort"
      onChange={setSelected}
      styles={colourStyles}
      value={selected}
      isSearchable={false}
      placeholder={'Сортировка'}
    />
  );
};

export default SortSelect;
