"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getActiveFilterChips } from "@/components/Filters/activeFilters";
import { ActiveChips, ActiveChip } from "@/app/styles/Filters.styles";
import { useEffect, useRef, useState } from "react";
import { setIsVisible } from "@/redux/FilmsMainPageSlice";
import { getAllFilmsFiltersThunk, getAllFilmsThunk, nextPage, setPage, clearFilms } from '@/redux/allFilmsSlice';
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
  FilterBadge,
} from "@/app/styles/AllFilmsPage.styles";
import Cards from "@/components/Cards/Cards";
import Sidebar from "@/components/Sidebar/Sidebar";
import Filters from "@/components/Filters/Filters";
import { MainTag } from "@/app/Main.styles";
import { useSearchParams } from "next/navigation";
import { setFilterGenre, setFilters, setUpdateGenre } from "@/redux/filtersSlice";
import { allGenres } from "@/data/allGenres";
import FilterIcon7 from "/public/Filtericon.svg";
import InfiniteScroll from '@/components/InfiniteScroll';

type CatalogSection = "movies" | "series" | "cartoons";

/** Какие типы контента показывать в разделе */
const SECTION_TYPES: Record<CatalogSection, string[]> = {
  movies: ["1"],
  series: ["2"],
  cartoons: ["3"],
};

/** Заголовки разделов */
const SECTION_TITLES: Record<CatalogSection, string> = {
  movies: "Все фильмы",
  series: "Все сериалы",
  cartoons: "Мультфильмы",
};

export default function CatalogPage({ section = "movies" }: { section?: CatalogSection }) {
  const loadingFilters = useAppSelector(
    (state: { loading: { loadingFilters: boolean } }) => state.loading.loadingFilters
  );
  const films = useAppSelector((state) => state.allFilms.films);
  const sectionTypes = SECTION_TYPES[section];
  const baseFilters = useAppSelector((state) => state.filters);
  // тип задаётся разделом, поэтому из состояния его подменяем
  const filtres = { ...baseFilters, selectedTypeOfMovies: sectionTypes };
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

  /*
   * Из адреса читаем ТОЛЬКО жанр: с главной на жанры ведёт ссылка вида
   * /films?genre=комедия, и фильтр должен примениться и показаться в панели.
   * Запись фильтров в адрес убрана — она была источником ошибок, а пользы
   * почти не давала.
   */
  useEffect(() => {
    const genreList = String(searchParams.get("genre") || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => {
        const needle = value.toLowerCase();
        return (
          allGenres.find(
            (genre) =>
              String(genre.value || "").toLowerCase() === needle ||
              String(genre.label || "").toLowerCase() === needle
          ) || { value, label: value, id: 0 }
        );
      });

    if (!genreList.length) return;

    dispatch(setFilterGenre(genreList));

    /*
     * Сразу перезапрашиваем каталог с новым жанром: иначе запрос, запущенный
     * со старым (пустым) состоянием, перезаписывает его и жанры теряются.
     */
    const merged = { ...filtres, genre: genreList };
    /* Карточки прошлого раздела надо убрать: иначе при переходе
       фильмы → сериалы на экране остаётся старый список */
    dispatch(clearFilms());
    dispatch(setFilters(merged as any));
    dispatch(setPage(1));
    dispatch(getAllFilmsFiltersThunk(merged as any, 1));
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

  // redux-страница сбрасывается при смене фильтров — тогда начинаем счёт заново
  useEffect(() => {
    if (page === 1) loadedPageRef.current = 1;
  }, [page]);

  const showMore = () => {
    // максимум из ref и redux: защищает и от повторного запроса в одном тике,
    // и от обнуления счётчика
    const pageToLoad = Math.max(loadedPageRef.current, page) + 1;
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

  // чипы изменённых фильтров: считаем один раз
  const activeChips = getActiveFilterChips(filtres);
  // видно, какой тип уходит в запрос: film / series / cartoons
  if (typeof window !== "undefined") {
    console.info("[раздел]", section, "| тип в запросе:", sectionTypes.join(","));
  }
  // отладка: видно, что реально приходит в фильтрах
  if (typeof window !== "undefined") {
    console.info("[фильтры] страна:", filtres.country, "| чипы:", activeChips.map((c) => c.label));
  }

  return (
    <>
      <MainTag>
        <Wrapper>
          <WrapperNameBlock>
            <div>
              <NameBlock>{SECTION_TITLES[section]}</NameBlock>
            </div>

                        <FilterIcon onClick={toggleSidebar}>
              <FilterIcon7 />
              {/* счётчик изменённых фильтров: по умолчанию его нет */}
              {activeChips.length > 0 && <FilterBadge>{activeChips.length}</FilterBadge>}
            </FilterIcon>
          </WrapperNameBlock>
          {/* Чипы — отдельной строкой под заголовком: если не помещаются,
              строка прокручивается вбок */}
          {activeChips.length > 0 && (
            <ActiveChips>
              {activeChips.map((chip) => (
                <ActiveChip key={chip.key}>{chip.label}</ActiveChip>
              ))}
            </ActiveChips>
          )}
          {resolution.width > 1150 ? <Filters mobile={false} hideTypes /> : ""}
          {/* <Filters /> */}
          <Sidebar toggleSidebar={toggleSidebar} isOpenSidebar={+isOpenSidebar}>
            {<Filters mobile={true} setIsOpenSidebar={setIsOpenSidebar} hideTypes />}
          </Sidebar>
          <Cards cards={films} />
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

/* export const getserverSideProps: GetServerSideProps = async(filtres: initialStateFiltersType, page: number) => {

  const allFilms = await filmsApi.getFilms(filtres, page)
  return {
    props: { allFilms }
  }

} */