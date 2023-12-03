import React, { useCallback } from 'react';
import Link from 'next/link';
import { GenreButton } from './GenreButton.types';
import { SvgDiv, Title, WrapperGenre } from '../../app/styles/GenreButton.styles';
import { useSearchParams } from 'next/navigation';
import { setFilterGenre, setUpdateGenre } from '@/redux/filtersSlice';
import { useAppDispatch } from '@/redux/hooks';
import ActionIcon from '../../../public/assets/icons/genres/actionIcon3.svg'
import Image from 'next/image';
import dynamic from 'next/dynamic';

type IconComponents = Record<string, React.ComponentType<{}>>;

const iconComponents: IconComponents = {
  'боевик': dynamic(() => import('../../../public/assets/icons/genres/actionIcon3.svg')),
  'фэнтези': dynamic(() => import('../../../public/assets/icons/genres/fantasyIcon.svg')),
  'фантастика': dynamic(() => import('../../../public/assets/icons/genres/fantasticIcon.svg')),
  'триллер': dynamic(() => import('../../../public/assets/icons/genres/thrillerIcon.svg')),
  'военный': dynamic(() => import('../../../public/assets/icons/genres/militaryIcon.svg')),
  'детектив': dynamic(() => import('../../../public/assets/icons/genres/detectiveIcon.svg')),
  'комедия': dynamic(() => import('../../../public/assets/icons/genres/comedyIcon.svg')),
  'драма': dynamic(() => import('../../../public/assets/icons/genres/dramaIcon.svg')),
  'ужасы': dynamic(() => import('../../../public/assets/icons/genres/horrorIcon.svg')),
  'криминал': dynamic(() => import('../../../public/assets/icons/genres/criminalIcon.svg')),
  'мелодрама': dynamic(() => import('../../../public/assets/icons/genres/melodramaIcon.svg')),
  'вестерн': dynamic(() => import('../../../public/assets/icons/genres/vesternIcon.svg')),
  'биография': dynamic(() => import('../../../public/assets/icons/genres/biographyIcon.svg')),
  'детский': dynamic(() => import('../../../public/assets/icons/genres/childIcon.svg')),
  'мультфильм': dynamic(() => import('../../../public/assets/icons/genres/cartoonIcon.svg')),
  'история': dynamic(() => import('../../../public/assets/icons/genres/historyIcon.svg')),
  'музыка': dynamic(() => import('../../../public/assets/icons/genres/musicIcon.svg')),
  'мюзикл': dynamic(() => import('../../../public/assets/icons/genres/musicalIcon.svg')),
  'приключения': dynamic(() => import('../../../public/assets/icons/genres/adventureIcon.svg')),
  'семейный': dynamic(() => import('../../../public/assets/icons/genres/familyIcon.svg')),
  'спорт': dynamic(() => import('../../../public/assets/icons/genres/sportIcon.svg')),
};

  


const GenreButton: React.FC<GenreButton> = ({title}) =>{
  const IconComponent = iconComponents[title] || ''
  const searchParams = useSearchParams()!
  const dispatch = useAppDispatch()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
 
      return params.toString()
    },
    [searchParams]
  )
    
  const setGenre = () => {
     dispatch(setUpdateGenre(true))
  };

    return (
    
      <Link href={'/films' + '?' + createQueryString('genre', title)}>
        <WrapperGenre onClick={setGenre}>
          <SvgDiv>
          <IconComponent />
          </SvgDiv>
          <Title>{title}</Title>
      </WrapperGenre>
      </Link>
    )
}

export default GenreButton;