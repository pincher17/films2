import React, { useEffect, useState } from 'react';

import Select, { StylesConfig } from 'react-select';
import { MultipleSelectProps } from '../MultipleSelect/MultipleSelect.types';
import { useAppSelector } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';




const MultipleSelectStudio: React.FC<MultipleSelectProps> = ({options, onChange}) => {
  const genre = useAppSelector((state: { filtersStudios: { genres: any; }; }) => state.filtersStudios.genres);
  const [selectedOption, setSelectedOption] = useState<any | null>(genre);

  const searchParams = useSearchParams()
  const searchGenre = searchParams.get('genre')

  useEffect(() => {
    if(Array.isArray(selectedOption)){
      onChange(selectedOption)
    }
    }, [selectedOption])

    useEffect(() => {
      setSelectedOption(genre)
      }, [genre])

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
    multiValue: (styles: any) => {
      return {
        ...styles,
        backgroundColor: '#494949',
        color: 'white'
      };
    },
    multiValueLabel: (styles: any) => {
      return {
        ...styles,
        backgroundColor: '#494949',
        color: 'white'
      };
    },
    placeholder: (styles: any) => {
      return {
        ...styles,
        color: '#ffffff',
      };
    },
    multiValueRemove: (styles: any) => {
      return {
        ...styles,
        ':hover': {
          backgroundColor: '#d32a29',
          color: 'white',
          cursor: 'pointer'
        },
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
      closeMenuOnSelect={false}
      isMulti
      options={options}
      name="colors"
      onChange={setSelectedOption}
      styles={colourStyles}
      value={selectedOption}
      isSearchable={false}
      /* defaultValue={[{ value: 'фэнтези', label: 'фэнтези' }]} */
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

export default MultipleSelectStudio