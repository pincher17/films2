'use client'
import s from './page.module.css';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';
import { getnewFilmsThunk } from '@/redux/newFilmsSlice';
import SwiperMainPage from '@/components/SwiperMainPage/SwiperMainPage';
import Header from '@/components/Header/Header';
import { setWidthDevice } from '@/redux/widthDeviceSlice';
import { MainTag } from './styles/Main.styles';
import MobileNavigation from '@/components/MobileNavigation/MobileNavigation';
import AllBlur from '@/components/AllBlur/AllBlur';
import { H1 } from './Main.styles';
import SwiperGenres from '@/components/SwiperGenres/SwiperGenres';
import Turnstile from '@/components/Turnstile/Turnstile';

export default function Home() {

  

  /* const loading = useAppSelector((state) => state.loading.loading); */
  /* const films = useAppSelector(state => state.newFilms.films); */
  const limit = useAppSelector(state => state.newFilms.limit);
  const dispatch = useAppDispatch()
 /*  const showMore = () => dispatch(addLimit()) */
  
  useEffect(() => {

    dispatch(getnewFilmsThunk(limit))

    }, [limit])

    useEffect(() => {
      const updateScreenResolution = () => {
        dispatch(setWidthDevice(window.innerWidth));
      };
  
      // Обновляем разрешение при изменении размеров окна
      window.addEventListener('resize', updateScreenResolution);
  
      // Инициализируем разрешение при первоначальной загрузке
      updateScreenResolution();
  
      // Отписываемся от события при размонтировании компонента
      return () => {
        window.removeEventListener('resize', updateScreenResolution);
      };
    }, []);

  return (
    <>
   {/*  {!isVerified ? (
        <Turnstile onToken={setToken} />
      ) : ( */}
        <>
      <AllBlur />
      <Header />
      <MainTag>
        <div className={s.wrapper}>
          {/*         <div className={s.wrapper_name_block}>
                <div>
                    <Link href="/films" className={s.btn}>
                        Все фильмы
                    </Link>
                </div>
        </div> */}
          <SwiperGenres />
          <SwiperMainPage />
        </div>
        <H1>Смотрите новинки кино и сериалов в онлайн кинотеатре Filmhub</H1>
        <p>
          Добро пожаловать на Filmhub – ваш персональный онлайн кинотеатр
          новинок кино и сериалов! Мы предлагаем широкий выбор фильмов в высоком
          качестве, чтобы вы могли насладиться увлекательными историями и
          захватывающими приключениями. Filmhub - ваш путь к захватывающему миру
          кино развлечений.
        </p>
      </MainTag>
      <MobileNavigation />
      </>
    {/* )} */}
    </>
  );
}
