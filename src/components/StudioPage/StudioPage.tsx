"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { setIsVisible } from "@/redux/FilmsMainPageSlice";
import {
  getAllFilmsFiltersThunk,
  getAllFilmsThunk,
  nextPage,
  setPage,
} from "@/redux/allFilmsStudio";
import {
  Button,
  CrossIcon,
  FilterIcon,
  Line1,
  Line2,
  NameBlock,
  Wrapper,
  WrapperButtonShowMore,
  WrapperNameBlock,
} from "../../app/styles/AllFilmsPage.styles";
import Cards from "@/components/Cards/Cards";
import Sidebar from "@/components/Sidebar/Sidebar";
import { MainTag } from "@/app/Main.styles";
import { useSearchParams } from "next/navigation";
import FilterIcon7 from "/public/Filtericon.svg";
import { initialStateFiltersStudioType, setFilters, setNameStudio } from "@/redux/filtersStudios";
import { allStudios } from "@/data/AllStudios";
import FiltersStudios from "../FiltersStudios";
import NetflixLogo from '../../../public/assets/img/studios-logo/Netflix_Logo.png';
import AppleTvLogo from '../../../public/assets/img/studios-logo/Apple-Tv-Logo.png';
import Hbo from '../../../public/assets/img/studios-logo/HBO.png';
import Amazon from '../../../public/assets/img/studios-logo/Amazon_Prime.png';
import Hulu from '../../../public/assets/img/studios-logo/Hulu.png';
import Kion from '../../../public/assets/img/studios-logo/Kion.png';
import Premier from '../../../public/assets/img/studios-logo/Premier.png';
import Disney from '../../../public/assets/img/studios-logo/Disney.png';
import DcUniverse from '../../../public/assets/img/studios-logo/DcUniverse.png';
import Okko from '../../../public/assets/img/studios-logo/Okko.png';
import Paramount from '../../../public/assets/img/studios-logo/Paramount.png';
import Max from '../../../public/assets/img/studios-logo/Max.png';
import Peacock from '../../../public/assets/img/studios-logo/Peacock.png';
import Roku from '../../../public/assets/img/studios-logo/Roku.png';
import { StaticImageData } from "next/image";
import { Image, NameStudio, WrapperImageStudio, WrapperName } from "./StudioPage.styles";


const logoMap: { [key: string]: StaticImageData } = {
  'netflix': NetflixLogo,
  'apple-tv': AppleTvLogo,
  'hbo': Hbo,
  'amazon-prime': Amazon,
  'hulu': Hulu,
  'kion': Kion,
  'premier': Premier,
  'disney': Disney,
  'dc-universe': DcUniverse,
  'okko': Okko,
  'paramount': Paramount,
  'max': Max,
  'peacock': Peacock,
  'roku-channel': Roku,
};

function getValueBySlug(slug: string): string | undefined {
    const studio = allStudios.find(studio => studio.slug === slug);
    return studio ? studio.value : undefined;
  }

function getLabelBySlug(slug: string): string | undefined {
    const studio = allStudios.find(studio => studio.slug === slug);
    return studio ? studio.label : undefined;
  }

const initialFilters: initialStateFiltersStudioType ={
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

export default function StudioPage({ params }: { params: { slug: string } }) {
  const slug = params.slug
  const logo = logoMap[slug]?.src || '';
  const films = useAppSelector((state) => state.allFilmsStudio.films);
  const filtres = useAppSelector((state) => state.filtersStudios);
  const page = useAppSelector((state) => state.allFilmsStudio.page);
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();

  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  const [resolution, setResolution] = useState<any>({ width: 0, height: 0 });

  useEffect(() => {
   const value = getValueBySlug(slug)
   if(value){
    console.log('dispatch', value)
    dispatch(setNameStudio(value))
   }
  }, [slug]);

  useEffect(() => {
    if (isOpenSidebar) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Возвращаем функцию для очистки класса при размонтировании компонента
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpenSidebar]);

  useEffect(() => {
    dispatch(setIsVisible(false));
    const updateScreenResolution = () => {
      setResolution({ width: window.innerWidth, height: window.innerHeight });
    };

    // Обновляем разрешение при изменении размеров окна
    window.addEventListener("resize", updateScreenResolution);

    // Инициализируем разрешение при первоначальной загрузке
    updateScreenResolution();

    // Отписываемся от события при размонтировании компонента
    return () => {
      window.removeEventListener("resize", updateScreenResolution);
    };
  }, []);


  useEffect(() => {
    const nameStudio = getValueBySlug(slug)
    const newNameStudio = nameStudio != filtres.nameStudio
    if (films.length === 0 || newNameStudio) {
      dispatch(setFilters(initialFilters))
      dispatch(setPage(1));
      dispatch(getAllFilmsFiltersThunk(initialFilters, 1, nameStudio));
    } else {
      return;
    }
  }, [slug]);

  const showMore = () => {
    const nameStudio = getValueBySlug(slug)
    dispatch(nextPage());
    dispatch(getAllFilmsThunk(filtres, page + 1, nameStudio));
  };

  const toggleSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };


  return (
    <>
      <MainTag>
        <Wrapper>
          <WrapperImageStudio>
            <Image
                src={logo} 
                alt={slug} 
                />
             </WrapperImageStudio>
          <WrapperName>
            <div>
              <NameStudio>
                {getLabelBySlug(slug)}
              </NameStudio>
            </div>
            <FilterIcon onClick={toggleSidebar}>
              <FilterIcon7 />
            </FilterIcon>
          </WrapperName>
          {resolution.width > 1150 ? <FiltersStudios mobile={false} /> : ""}
          {/* <Filters /> */}
          <Sidebar toggleSidebar={toggleSidebar} isOpenSidebar={+isOpenSidebar}>
            <CrossIcon sidebar={+true} onClick={toggleSidebar}>
              <Line1 />
              <Line2 />
            </CrossIcon>
            {<FiltersStudios mobile={true} setIsOpenSidebar={setIsOpenSidebar} />}
          </Sidebar>
          <Cards cards={films} />
          <WrapperButtonShowMore>
            <Button onClick={showMore}>Показать еще</Button>
          </WrapperButtonShowMore>
        </Wrapper>
      </MainTag>
    </>
  );
}