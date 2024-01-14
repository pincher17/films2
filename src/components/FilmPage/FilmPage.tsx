"use client";

/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useRef } from "react";
import LayoutFilm from "../layoutFilm/LayoutFilm";
import SwiperFilms from "../SwiperFilms/SwiperFilms";
import {
  Description,
  Iframe,
  ImgMain,
  ImgWrapFilm,
  ImgWrapperFilm,
  Strong,
  SwiperWrapperSimilar,
  TitleDescription,
  Wrapper,
  WrapperIframe,
  WrapperInfo,
  WrapperWatchFilm,
} from "../../app/styles/FilmPage.styles";
import Trailer from "../Trailer/Trailer";
import SkeletonImage from "../SkeletonImage/SkeletonImage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getFilmById } from "@/redux/filmInfoSlice";
import FilmPageMobile from "../FilmPageMobile/FilmPageMobile";
import FilmInfoText from "../FilmInfoText/FilmInfoText";
import { Bottom } from "@/app/styles/FilmPageMobile.styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import translateCategory from "../helpers/translateCategory";

export default function FilmPage({ params }: { params: { id: number } }) {
  let id = params.id;
  const dispatch = useAppDispatch();
  const filmInfoId = useAppSelector((state) => state.filmInfo.info);
  const loading = useAppSelector((state) => state.loading.loading);
  const { preview, countries, genres, ratingKinopoisk } = useAppSelector(
    (state) => state.filmInfo
  );
  const refDataFilm = useRef<HTMLInputElement | null>(null);
  const [resolution, setResolution] = React.useState<any>({
    width: 0,
    height: 0,
  });

  const [value, setValue] = React.useState("one");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
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
    dispatch(getFilmById(id));
  }, [id]);

  useEffect(() => {
    refDataFilm.current?.setAttribute("data-kinopoisk", `${id}`);
  }, [id, resolution.width]);

  /*   useEffect(() => {
    const script = document.createElement("script");
    //script.src = "//yohoho.cc/yo.js";
    script.src = "https://v1687693103.bazon.site/js/bazon.js";
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
    }, [id]); */

  if (resolution.width < 850) {
    return (
      <FilmPageMobile
        params={{
          id,
        }}
      />
    );
  }

  return (
    <Wrapper>
      <LayoutFilm>
        <WrapperInfo>
          <FilmInfoText
            countries={countries}
            filmInfoId={filmInfoId}
            genres={genres}
            ratingKinopoisk={ratingKinopoisk}
            resolution={resolution}
          />
          <WrapperWatchFilm>
            <div>
              {/* <img itemProp= "image" className={s.img} src={preview} alt={filmInfoId?.name} /> */}
              {loading ? (
                <SkeletonImage />
              ) : (
                <ImgWrapperFilm>
                  <ImgWrapFilm>
                    <ImgMain
                      src={filmInfoId?.poster.previewUrl}
                      alt={filmInfoId?.name}
                      itemProp="contentUrl"
                    />
                  </ImgWrapFilm>
                </ImgWrapperFilm>
              )}
            </div>
            <WrapperIframe key={id.toString()}>
              {/* <div key={id + id} className={s.film} ref={refDataFilm} id="yohoho" data-tv="1" ></div> */}
              {/* <div key={id} ref={refDataFilm} id='bazon' data-width='600' data-height='400'></div> */}
              {/* https://vid1648731340.vb17121coramclean.pw/play/${id}?d=filmhub.lol */}
              {/* https://unsightly-lock.cdnmovies-stream.online/kinopoisk/${id}/iframe?domain=filmhub.lol */}
              <Box sx={{ width: "100%" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="inherit"
                  aria-label="secondary tabs example"
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "#d41515"
                    }
                  }}
                >
                  <Tab value="one" label="Плеер 1" />
                  <Tab value="two" label="Плеер 2" />
                </Tabs>
              </Box>
              {value === "one" ? <Iframe
                src={`https://vb17123filippaaniketos.pw/play/${id}/iframe?d=filmhub.lol`}
                frameBorder="0"
                scrolling="no"
                allowFullScreen
                referrerPolicy="origin"
                width="500"
                height="352"
              ></Iframe>
              : <Iframe
              src={`https://unsightly-lock.cdnmovies-stream.online/kinopoisk/${id}/iframe?domain=filmhub.lol`}
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              referrerPolicy="origin"
              width="500"
              height="352"
            ></Iframe>
            }
            <Strong>Смотреть онлайн {filmInfoId?.type && translateCategory(filmInfoId.type)} {filmInfoId?.name} {filmInfoId?.year} года в хорошем качестве</Strong>
            </WrapperIframe>
          </WrapperWatchFilm>
          {filmInfoId?.videos && filmInfoId?.videos.trailers[0] ? (
            <Trailer src={`${filmInfoId?.videos.trailers[0].url}`} />
          ) : (
            ""
          )}
        </WrapperInfo>

        {resolution.width > 1150 || resolution.width < 850 ? (
          <>
            <TitleDescription>Описание:</TitleDescription>
            <Description>{filmInfoId?.description}</Description>
          </>
        ) : (
          ""
        )}

    <SwiperWrapperSimilar>
          {filmInfoId?.sequelsAndPrequels && filmInfoId?.sequelsAndPrequels.length ? (
            <>
              <TitleDescription>Сиквелы и приквелы</TitleDescription>
              <SwiperFilms cards={filmInfoId?.sequelsAndPrequels} />
            </>
          ) : (
            ""
          )}
        </SwiperWrapperSimilar>

        <SwiperWrapperSimilar>
          {filmInfoId?.similarMovies && filmInfoId?.similarMovies.length ? (
            <>
              <TitleDescription>Похожие</TitleDescription>
              <SwiperFilms cards={filmInfoId?.similarMovies} />
            </>
          ) : (
            ""
          )}
        </SwiperWrapperSimilar>
        <Bottom />
      </LayoutFilm>
    </Wrapper>
  );
}
