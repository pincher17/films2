import React, { useEffect, useRef } from "react";
import { SwiperMainPageProps } from "./SwiperMainPage.types";
import { SwiperWrapper } from "../../app/styles/SwiperMainPage.styles";
import SwiperFilms from "../SwiperFilms/SwiperFilms";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getBoevik, getComedy, getDrama, getFilmsThunk, getFilmsTop10, getSeries, getThriller, setIsVisible } from "@/redux/FilmsMainPageSlice";
import { CollectionType } from "@/types/CollectionType";



const SwiperMainPage: React.FC<SwiperMainPageProps> = () => {
  const dispatch = useAppDispatch()
  const widthDevice = useAppSelector(state => state.widthDevice.width)
  const isVisible = useAppSelector(state => state.filmsMainPage.isVisible)
  const loading = useAppSelector((state) => state.loading.loading);
  const films = useAppSelector(state => state.filmsMainPage.films)
  const series = useAppSelector(state => state.filmsMainPage.series)
  const top10 = useAppSelector(state => state.filmsMainPage.top10)
  const thriller = useAppSelector(state => state.filmsMainPage.thriller)
  const comedy = useAppSelector(state => state.filmsMainPage.comedy)
  const drama = useAppSelector(state => state.filmsMainPage.drama)
  const boevik = useAppSelector(state => state.filmsMainPage.boevik)
  const collections = useAppSelector(state => state.collections.collections)

  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(widthDevice > 1030){
      dispatch(setIsVisible(true))
    }

    }, [widthDevice])

  useEffect(() => {
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        dispatch(setIsVisible(true))
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    dispatch(getFilmsTop10())
    dispatch(getFilmsThunk())
    dispatch(getSeries())
    dispatch(getThriller())
    dispatch(getComedy())
    dispatch(getDrama())
    dispatch(getBoevik())
    }, [])

/*     const responseDataFilmsTop10 = await filmsApi.getFilmsTop10()
    const dataFilmsTop10 = responseDataFilmsTop10.data.docs.top10

    const responseDataFilms = await filmsApi.getFilmsMainPage()
    const dataFilms = responseDataFilms.data.docs.films

    const responseDataSeries = await filmsApi.getSeriesMainPage()
    const dataSeries = responseDataSeries.data.docs.series

    const responseDataFilmsThriller = await filmsApi.getFilmsThrillerMainPage()
    const datailmsThriller = responseDataFilmsThriller.data.docs.thriller

    const responseDataFilmsComedy = await filmsApi.getFilmsComedyMainPage()
    const dataFilmsComedy = responseDataFilmsComedy.data.docs.comedy

    const responseDataFilmsDrama = await filmsApi.getFilmsDramaMainPage()
    const dataFilmsDrama = responseDataFilmsDrama.data.docs.drama

    const responseDataFilmsBoevik = await filmsApi.getFilmsBoevikMainPage()
    const dataFilmsBoevik = responseDataFilmsBoevik.data.docs.boevik */
    
    
  return (
    <>
  <SwiperWrapper>
  <SwiperFilms cards={top10} title="Топ 10"/>
  </SwiperWrapper>

  <SwiperWrapper>
  <SwiperFilms collections={collections} title="Коллекции"/>
  </SwiperWrapper>

  <SwiperWrapper>
  <SwiperFilms cards={films} title="Фильмы" />
  </SwiperWrapper>
 

  
  <>

  <SwiperWrapper>
  <SwiperFilms cards={series} title="Сериалы" />
  </SwiperWrapper>

  <SwiperWrapper ref={elementRef}>
  <SwiperFilms cards={thriller} title="Триллеры"/>
  </SwiperWrapper>

  <SwiperWrapper>
  <SwiperFilms cards={comedy} title="Комедии"/>
  </SwiperWrapper>

  <SwiperWrapper>
  <SwiperFilms cards={drama} title="Драма"/>
  </SwiperWrapper>

  <SwiperWrapper>
  <SwiperFilms cards={boevik} title="Боевики"/>
  </SwiperWrapper>
  </>

  </>

  )
  }

  export default SwiperMainPage