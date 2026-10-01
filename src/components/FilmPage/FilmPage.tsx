"use client";

/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useRef, useState } from "react";
import LayoutFilm from "../layoutFilm/LayoutFilm";
import SwiperFilms from "../SwiperFilms/SwiperFilms";
import {
  Backdrop,
  BackdropImage,
  BackdropShade,
  Description,
  Hero,
  HeroButton,
  HeroButtons,
  HeroDescription,
  HeroDot,
  HeroMeta,
  HeroPoster,
  HeroScore,
  HeroText,
  HeroTitle,
  PosterBlock,
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
import { CloseIconTrailer, IframeTrailer, Overlay } from "../../app/styles/Trailer.styles";
import { Line1, Line2 } from "../../app/styles/AllFilmsPage.styles";
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
import roundNumber from "../helpers/rounding";
import Turnstile from "../Turnstile/Turnstile";
import { isTurnstileDisabled } from "../Turnstile/turnstileConfig";
import KinoboxPlayer from "../KinoboxPlayer/KinoboxPlayer";
import StreamPlayer from "../StreamPlayer/StreamPlayer";
import { getFilmStreams } from "@/data/streams";

export default function FilmPage({ params }: { params: { id: number } }) {
  let id = params.id;
  // если для фильма заданы свои ссылки — играем их в своём плеере
  const streams = getFilmStreams(id);
  const dispatch = useAppDispatch();
  const filmInfoId = useAppSelector((state) => state.filmInfo.info);
  const loading = useAppSelector((state) => state.loading.loading);
  const { preview, countries, genres, ratingKinopoisk } = useAppSelector(
    (state) => state.filmInfo
  );
  const refDataFilm = useRef<HTMLInputElement | null>(null);
  // большой фон: бэкдроп TMDB, при его отсутствии — постер в размытии
  const heroImage = filmInfoId?.backdrop?.url || filmInfoId?.poster?.url;
  const heroBlurred = !filmInfoId?.backdrop?.url;
  const [resolution, setResolution] = React.useState<any>({
    width: 0,
    height: 0,
  });

  const [value, setValue] = React.useState("one");
  // трейлер открывается модальным окном поверх страницы, а не новой вкладкой
  const [trailerOpen, setTrailerOpen] = React.useState(false);

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

  ///////////////////////////////////////
  //////////////////////////////////////
  const [token, setToken] = useState(null);
  // При локальной разработке Cloudflare Turnstile не нужен
  const [isVerified, setIsVerified] = useState(isTurnstileDisabled());

 /*  useEffect(() => {
    setIsVerified(false); // Reset verification status when component mounts
    setToken(null); // Reset token when component mounts
  }, [id]); */

  useEffect(() => {
    // Check if the user is already verified in session storage
    const verifiedStatus = sessionStorage.getItem('isVerified');
    if (verifiedStatus === 'true') {
      setIsVerified(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const handleVerification = async () => {
        const response = await fetch('/api/verify-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();
        if (result.success) {
          setIsVerified(true);
          sessionStorage.setItem('isVerified', 'true'); // Store verification status in session storage
        } else {
          alert('Verification failed. Please try again.');
        }
      };

      handleVerification();
    }
  }, [token]);
///////////////////////////////////////
  //////////////////////////////////////

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
      <>
    {!isVerified ? (
      <Turnstile onToken={setToken} />
    ) : (
      <FilmPageMobile
        params={{
          id,
        }}
      />
    )}
      </>
    );
  }

  return (
    <>
    {!isVerified ? (
      <Turnstile onToken={setToken} />
    ) : (
    <Wrapper>
      {heroImage ? (
        <Backdrop>
          <BackdropImage src={heroImage} alt="" $blurred={heroBlurred} />
          <BackdropShade />
        </Backdrop>
      ) : null}
      <LayoutFilm>
        {filmInfoId?.name ? (
          <Hero>
            <HeroText>
            <HeroTitle itemProp="name">{filmInfoId.name}</HeroTitle>
            <HeroMeta>
              {filmInfoId.year ? <span>{filmInfoId.year}</span> : null}
              {ratingKinopoisk ? (
                <>
                  <HeroDot />
                  <HeroScore>{roundNumber(ratingKinopoisk, 1)}</HeroScore>
                </>
              ) : null}
              {filmInfoId.movieLength ? (
                <>
                  <HeroDot />
                  <span>{filmInfoId.movieLength} мин</span>
                </>
              ) : null}
              {genres.length ? (
                <>
                  <HeroDot />
                  <span>{genres.slice(0, 3).map((genre: any) => genre.name).join(", ")}</span>
                </>
              ) : null}
              {countries.length ? (
                <>
                  <HeroDot />
                  <span>{countries.slice(0, 2).map((country: any) => country.name).join(", ")}</span>
                </>
              ) : null}
            </HeroMeta>
            <HeroButtons>
              <HeroButton
                $primary
                type="button"
                onClick={() =>
                  document
                    .getElementById("fh-player")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
              >
                ▶ Смотреть
              </HeroButton>
              {filmInfoId?.videos?.trailers?.[0] ? (
                <HeroButton type="button" onClick={() => setTrailerOpen(true)}>
                  Трейлер
                </HeroButton>
              ) : null}
            </HeroButtons>
            {filmInfoId?.description ? (
              <HeroDescription>{filmInfoId.description}</HeroDescription>
            ) : null}
            </HeroText>

            {filmInfoId?.poster?.previewUrl ? (
              <HeroPoster>
                <img
                  src={filmInfoId.poster.previewUrl}
                  alt={filmInfoId.name}
                  itemProp="image"
                />
              </HeroPoster>
            ) : null}
          </Hero>
        ) : null}
        <WrapperInfo>
          <WrapperWatchFilm>
            <PosterBlock>
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
            </PosterBlock>
            <WrapperIframe key={id.toString()} id="fh-player">
              {/* <div key={id + id} className={s.film} ref={refDataFilm} id="yohoho" data-tv="1" ></div> */}
              {/* <div key={id} ref={refDataFilm} id='bazon' data-width='600' data-height='400'></div> */}
              {/* https://vid1648731340.vb17121coramclean.pw/play/${id}?d=filmhub.lol */}
              {/* https://unsightly-lock.cdnmovies-stream.online/kinopoisk/${id}/iframe?domain=filmhub.lol */}
              {streams ? (
                <StreamPlayer
                  filmId={id}
                  streams={streams}
                  poster={filmInfoId?.poster?.previewUrl}
                />
              ) : (
                <>
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
                  {value === "two" ? <KinoboxPlayer kpId={id} />
                  : <Iframe
                  src={`https://api.ortified.ws/embed/kp/${id}`}
                  frameBorder="0"
                  scrolling="no"
                  allowFullScreen
                  referrerPolicy="origin"
                  width="500"
                  height="352"
                ></Iframe>
                }
                </>
              )}
            </WrapperIframe>
          </WrapperWatchFilm>
        </WrapperInfo>


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

      {trailerOpen && filmInfoId?.videos?.trailers?.[0] ? (
        <Overlay onClick={() => setTrailerOpen(false)}>
          <CloseIconTrailer
            sidebar={+true}
            onClick={() => setTrailerOpen(false)}
          >
            <Line1 />
            <Line2 />
          </CloseIconTrailer>
          <IframeTrailer
            src={filmInfoId.videos.trailers[0].url}
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="origin"
          />
        </Overlay>
      ) : null}
    </Wrapper>
     )} 
    </>
  );
}
