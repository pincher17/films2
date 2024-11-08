import React, { useEffect, useState } from 'react';

import Select, { StylesConfig } from 'react-select';
import { useAppSelector } from '@/redux/hooks';
import { MultipleSelectProps } from '../SelectCountry/SelectCountry.types';

const allCountry = [  { value: '', label: 'Все', id: 1 },
{ value: '&countries.name=Беларусь&countries.name=Казахстан&countries.name=Украина&countries.name=СССР&countries.name=Россия', label: 'Русские', id: 2 },
{ value: `&countries.name=!Беларусь&countries.name=!Казахстан&countries.name=!Украина&countries.name=!СССР&countries.name=!Россия&countries.name=!Корея Южная&countries.name=!Китай&countries.name=!Таиланд&countries.name=!Индия&countries.name=!Япония&countries.name=!Тайвань&countries.name=!Турция`, label: 'Зарубежные', id: 3 },]


const SelectCountryStudios: React.FC<MultipleSelectProps> = ({onChange}) => {
  const country = useAppSelector((state: { filtersStudios: { country: any; }; }) => state.filtersStudios.country);
  const [selectedCountry, setSelectedCountry] = useState<any | null>(country);


  useEffect(() => {
      onChange(selectedCountry)
    }, [selectedCountry])

  const colourStyles: StylesConfig = {
    control: (baseStyles: any, state: { isFocused: any; }) => ({
      ...baseStyles,
      color: 'white',
      background: '#0e0e0e',
      width: '300px',
      borderColor: state.isFocused ? '#747474' : 'rgb(52 52 52)',
      boxShadow: 'none',
      flex: 1,
      cursor: 'pointer',
    }),
    menu: (base: any) => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0
    }),
    menuList: (base: any) => ({
      ...base,
      background: '#0e0e0e'
    }),
    singleValue: (styles: any) => {
      return {
        ...styles,
        color: 'white'
      };
    },
    placeholder: (styles: any) => {
      return {
        ...styles,
        color: '#ffffff',
      };
    },
    option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
      return {
        ...styles,
        ':hover': {
          backgroundColor: isDisabled
            ? undefined
            : isSelected
            ? '#494949'
            : isFocused
            ? '#494949'
            : undefined,
          color: 'white',
          cursor: 'pointer'
        },
        backgroundColor: isDisabled
      ? undefined
      : isSelected
      ? undefined
      : isFocused
      ? '#494949'
      : undefined,
      };
    },
  } 
  return (
    <Select
      closeMenuOnSelect={true}
      options={allCountry}
      name="colors"
      onChange={setSelectedCountry}
      styles={colourStyles}
      value={selectedCountry}
      isSearchable={false}
      placeholder={'Выбрать'}
      theme={(theme) => ({
      ...theme,
      borderRadius: 5,
      colors: {
        ...theme.colors,
        primary25: 'hotpink',
        primary: '#747474',
      },
    })}
    />
  );
}

export default SelectCountryStudios