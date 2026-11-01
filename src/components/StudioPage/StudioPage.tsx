"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getActiveFilterChips } from "@/components/Filters/activeFilters";
import { ActiveChip, ActiveChips } from "@/app/styles/Filters.styles";
import { FilterBadge } from "@/app/styles/AllFilmsPage.styles";
import { useEffect, useRef, useState } from "react";
import { setIsVisible } from "@/redux/FilmsMainPageSlice";
import { getAllFilmsFiltersThunk, getAllFilmsThunk, nextPage, setPage, clearFilms } from "@/redux/allFilmsStudio";
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
import StudioTypeSwitcher from "@/components/StudioTypeSwitcher/StudioTypeSwitcher";
import { genresForSection } from "@/data/genresBySection";
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
import InfiniteScroll from '@/components/InfiniteScroll';


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
    year: [1960, 2026],
    rating: [1, 10],
    sortByRelease: '-1',
    genres: [],
    typeOfMovies: [
        {name: 'Фильмы', included: true, typeNumber: '1'},
        {name: 'Сериалы', included: true, typeNumber: '2'},
        {name: 'Мультфильмы', included: true, typeNumber: '3'},
    ],
    selectedTypeOfMovies: ['1'],
    country: [  { value: '', label: 'Все', id: 1 }],   
}

export default function StudioPage({
  params,
  type = "1",
}: {
  params: { slug: string };
  /* Тип контента задаётся страницей: /studio/x — фильмы, /studio/x/series — сериалы */
  type?: string;
}) {
  const slug = params.slug;
  /* Тип раздела: страница сама его задаёт, переключатель только ведёт по ссылкам */
  const sectionType = type;
  const logo = logoMap[slug]?.src || '';
  const films = useAppSelector((state) => state.allFilmsStudio.films);
  const filtres = useAppSelector((state) => state.filtersStudios);
  const page = useAppSelector((state) => state.allFilmsStudio.page);
  const dispatch = useAppDispatch();
  // автоподгрузка: стоп, когда новых карточек не пришло
  const loadingFilters = useAppSelector(
    (state: { loading: { loadingFilters: boolean } }) => state.loading.loadingFilters
  );
  // последняя запрошенная страница: считаем её сами, а не по длине списка
  const loadedPageRef = useRef(1);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const prevCount = useRef(0);
  const stuckCount = useRef(0);

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


  /* Отладка: видно, какой раздел открыт, какие фильтры уходят и что приходит.
     Нужно, чтобы понять, откуда берётся смешивание типов. */
  useEffect(() => {
    console.info(
      "[студия] раздел:", sectionType,
      "| slug:", slug,
      "| карточек в сторе:", films.length,
      "| первые:", JSON.stringify(films.slice(0, 3).map((f: any) => ({ id: f?.id, name: f?.name, type: f?.type })))
    );
  }, [films, sectionType, slug]);

  /* Зависимость от типа обязательна: /studio/x и /studio/x/series — разные
     страницы с одинаковым slug, и без неё карточки оставались прежними. */
  useEffect(() => {
    const nameStudio = getValueBySlug(slug)
    const fresh = { ...initialFilters, selectedTypeOfMovies: [sectionType] };
    /* Карточки прошлого типа убираем: иначе фильмы, сериалы и мультики
       смешиваются в одну кучу при переходе между страницами */
    /* Счётчик страниц и признак «всё загружено» тоже сбрасываем: иначе
       бесконечная прокрутка сразу догружает страницу прошлого типа */
    loadedPageRef.current = 1;
    stuckCount.current = 0;
    setAllLoaded(false);
    dispatch(clearFilms())
    dispatch(setFilters(fresh as any))
    dispatch(setPage(1));
    console.info("[студия] запрос:", { sectionType, types: fresh.selectedTypeOfMovies, nameStudio });
    dispatch(getAllFilmsFiltersThunk(fresh as any, 1, nameStudio));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, sectionType]);

  useEffect(() => {
    if (films.length > prevCount.current) {
      prevCount.current = films.length;
      stuckCount.current = 0;
      setAllLoaded(false);
    } else if (films.length > 0) {
      // считаем «всё загружено» только после двух подряд попыток без новых карточек
      stuckCount.current += 1;
      if (stuckCount.current >= 3) setAllLoaded(true);
    }
  }, [films]);

  // redux-страница сбрасывается при смене фильтров — тогда начинаем счёт заново
  useEffect(() => {
    if (page === 1) loadedPageRef.current = 1;
  }, [page]);

  /* Переключение типа должно перезагружать карточки: без этого пилюля
     меняла подсветку, а список оставался прежним */
  const typeKey = (filtres.selectedTypeOfMovies || []).map(String).join(",");
  useEffect(() => {
    dispatch(setPage(1));
    dispatch(getAllFilmsThunk(filtres, 1, filtres.nameStudio));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeKey]);

  /* Жанры зависят от выбранного типа: у фильмов, сериалов и мультиков они разные */
  const studioKind =
    (filtres.selectedTypeOfMovies || []).map(String)[0] === "2"
      ? "series"
      : (filtres.selectedTypeOfMovies || []).map(String)[0] === "3"
      ? "cartoons"
      : "movies";
  const studioGenres = genresForSection(studioKind);

  // чипы изменённых фильтров — как в каталоге
  const activeChips = getActiveFilterChips(filtres);

  const showMore = () => {
    /* во время смены типа список ещё не готов — догрузка подмешает старое */
    if (loadingFilters) return;
    // максимум из ref и redux: защищает и от повторного запроса в одном тике,
    // и от обнуления счётчика
    const pageToLoad = Math.max(loadedPageRef.current, page) + 1;
    loadedPageRef.current = pageToLoad;
    dispatch(nextPage());
    dispatch(getAllFilmsThunk(filtres, pageToLoad, filtres.nameStudio));
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
            {/* Пока шторка открыта, кнопка не нужна: иначе получалось два крестика */}
            {!isOpenSidebar && (
              <FilterIcon onClick={toggleSidebar}>
                <FilterIcon7 />
                {activeChips.length > 0 && <FilterBadge>{activeChips.length}</FilterBadge>}
              </FilterIcon>
            )}
          </WrapperName>
          {/* Тип контента — как в каталоге: один тап вместо галочек в шторке */}
          {/* Жанры зависят от типа: у фильмов, сериалов и мультиков они разные */}
          <StudioTypeSwitcher
            slug={slug}
            active={sectionType === "2" ? "/series" : sectionType === "3" ? "/cartoons" : ""}
          />
          {activeChips.length > 0 && (
            <ActiveChips>
              {activeChips.map((chip) => (
                <ActiveChip key={chip.key}>{chip.label}</ActiveChip>
              ))}
            </ActiveChips>
          )}
          {resolution.width > 1150 ? <FiltersStudios mobile={false} hideTypes genres={studioGenres} /> : ""}
          {/* <Filters /> */}
          <Sidebar toggleSidebar={toggleSidebar} isOpenSidebar={+isOpenSidebar}>
            <FiltersStudios mobile={true} setIsOpenSidebar={setIsOpenSidebar} hideTypes genres={studioGenres} />
          </Sidebar>
          <Cards key={sectionType} cards={films} />
          <InfiniteScroll
            count={films.length}
            onLoad={showMore}
            disabled={loadingFilters || films.length === 0}
          />
          <WrapperButtonShowMore>
            <Button onClick={showMore}>Показать еще</Button>
          </WrapperButtonShowMore>
        </Wrapper>
      </MainTag>
    </>
  );
}