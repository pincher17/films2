"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useRef, useState } from "react";
import { setIsVisible } from "@/redux/FilmsMainPageSlice";
import {
  getAllFilmsFiltersThunk,
  getAllFilmsThunk,
  nextPage,
  setPage,
} from "@/redux/allFilmsSlice";
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
} from "../../styles/AllFilmsPage.styles";
import Cards from "@/components/Cards/Cards";
import Sidebar from "@/components/Sidebar/Sidebar";
import Filters from "@/components/Filters/Filters";
import { MainTag } from "@/app/Main.styles";
import { useSearchParams } from "next/navigation";
import { setFilterGenre, setUpdateGenre } from "@/redux/filtersSlice";
import { allGenres } from "@/data/allGenres";
import FilterIcon7 from "/public/Filtericon.svg";
import InfiniteScroll from '@/components/InfiniteScroll';

export default function Films() {
  const loadingFilters = useAppSelector(
    (state: { loading: { loadingFilters: boolean } }) => state.loading.loadingFilters
  );
  const films = useAppSelector((state) => state.allFilms.films);
  const filtres = useAppSelector((state) => state.filters);
  const page = useAppSelector((state) => state.allFilms.page);
  const dispatch = useAppDispatch();
  /* const didMountFiltres = useRef(true); */
  /* const [didMountFiltres, setDidMountFiltres] = useState<boolean>(false) */
  /* const didMountPage = useRef(true); */

  const searchParams = useSearchParams();
  const searchGenre = searchParams.get("genre");

  const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
  // автоподгрузка: останавливаемся, когда новых карточек не пришло
  // последняя запрошенная страница: считаем её сами, а не по длине списка
  const loadedPageRef = useRef(1);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const prevCount = useRef(0);
  const stuckCount = useRef(0);
  const [resolution, setResolution] = useState<any>({ width: 0, height: 0 });
  /* const arraySkeletonCards = [1,2,3,4,5,6,7,8,9,10]; */

  const isGenreValid: boolean = allGenres.some(
    (genre) => genre.value === searchGenre
  );

  useEffect(() => {
    if (isGenreValid) {
      dispatch(setFilterGenre([{ value: searchGenre, label: searchGenre }]));
    } else {
      return;
    }
  }, []);

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

  /* const dataFilms = await filmsApi.getFilms(filtres, page) */

  useEffect(() => {
    if (films.length === 0 || filtres.updateGenre) {
      dispatch(setPage(1));
      console.log("first");
      let searchGenreArr = isGenreValid
        ? [{ value: searchGenre, label: searchGenre }]
        : [];
      dispatch(getAllFilmsFiltersThunk(filtres, 1, searchGenreArr));
      dispatch(setUpdateGenre(false));
    } else {
      return;
    }
  }, []);

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

  // смена фильтров — снова с первой страницы
  useEffect(() => {
    loadedPageRef.current = 1;
  }, [filtres]);

  const showMore = () => {
    const pageToLoad = loadedPageRef.current + 1;
    loadedPageRef.current = pageToLoad;
    dispatch(nextPage());
    dispatch(getAllFilmsThunk(filtres, pageToLoad));
  };

  const toggleSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  const searchGenreOne = () => {
    return filtres.genre[0].label;
  };

  return (
    <>
      <MainTag>
        <Wrapper>
          <WrapperNameBlock>
            <div>
              <NameBlock>
                {filtres.genre.length == 1
                  ? searchGenreOne().charAt(0).toUpperCase() +
                    searchGenreOne().slice(1)
                  : "Все фильмы"}
              </NameBlock>
            </div>
            <FilterIcon onClick={toggleSidebar}>
              <FilterIcon7 />
            </FilterIcon>
          </WrapperNameBlock>
          {resolution.width > 1150 ? <Filters mobile={false} /> : ""}
          {/* <Filters /> */}
          <Sidebar toggleSidebar={toggleSidebar} isOpenSidebar={+isOpenSidebar}>
            <CrossIcon sidebar={+true} onClick={toggleSidebar}>
              <Line1 />
              <Line2 />
            </CrossIcon>
            {<Filters mobile={true} setIsOpenSidebar={setIsOpenSidebar} />}
          </Sidebar>
          <Cards cards={films} />
          <InfiniteScroll
            count={films.length}
            onLoad={showMore}
            disabled={allLoaded || loadingFilters}
          />
          <WrapperButtonShowMore>
            <Button onClick={showMore}>Показать еще</Button>
          </WrapperButtonShowMore>
        </Wrapper>
      </MainTag>
    </>
  );
}

/* export const getserverSideProps: GetServerSideProps = async(filtres: initialStateFiltersType, page: number) => {

  const allFilms = await filmsApi.getFilms(filtres, page)
  return {
    props: { allFilms }
  }

} */