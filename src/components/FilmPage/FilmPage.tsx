"use client";

/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useRef, useState } from "react";
import LayoutFilm from "../layoutFilm/LayoutFilm";
import SwiperFilms from "../SwiperFilms/SwiperFilms";
import {
  ActorCard,
  ActorName,
  ActorPhoto,
  ActorRole,
  Backdrop,
  BigStill,
  DetailsGrid,
  DetailsLabel,
  DetailsRow,
  DetailsSection,
  DetailsValue,
  StillCard,
  StillOverlay,
  BackdropImage,
  BackdropShade,
  Description,
  Hero,
  HeroButton,
  HeroButtons,
  HeroDescription,
  HeroDot,
  HeroFacts,
  HeroMeta,
  HeroMore,
  HeroPoster,
  HeroScore,
  HeroSlogan,
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
import { SaveFilmButton } from '@/app/styles/SaveFilmButton.styles';
import { BookmarkIcon } from '@/app/styles/Card.styles';
import { useSaved } from '@/components/SavedProvider/SavedProvider';
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
import { SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Mousewheel, Navigation } from "swiper/modules";
import {
  StyledSlider as ActorsSlider,
  Title as ActorsTitle,
  Wrapper as ActorsWrapper,
  WrapperSlide as ActorsSlide,
} from "../../app/styles/SwiperFilms.styles";
import StreamPlayer from "../StreamPlayer/StreamPlayer";
import { getFilmStreams } from "@/data/streams";
import FilmSkeleton from "../FilmSkeleton/FilmSkeleton";
import PlayerBridge from "../PlayerBridge/PlayerBridge";
import ResumeHint from "../ResumeHint/ResumeHint";
import WatchTracker from "../WatchTracker/WatchTracker";
import SoundtrackSection from "../SoundtrackSection/SoundtrackSection";

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

  // детали под описанием — всё это уже приходит из TMDB
  const heroPersons: any[] = (filmInfoId as any)?.persons || [];
  const heroDirector = heroPersons
    .filter((person: any) =>
      ["director", "Director", "Режиссер"].includes(person?.enProfession || person?.profession)
    )
    .map((person: any) => person.name)
    .slice(0, 2)
    .join(", ");
  const heroCast = heroPersons
    .filter((person: any) => person?.enProfession === "actor")
    .map((person: any) => person.name)
    .slice(0, 4);
  const actorsRef = useRef<HTMLDivElement | null>(null);
  const actors: any[] = (((filmInfoId as any)?.persons || []) as any[])
    .filter((person: any) => person?.enProfession === "actor" && person?.photo)
    .slice(0, 20);

  const heroBudget = (filmInfoId as any)?.budget?.value
    ? `$${Math.round((filmInfoId as any).budget.value / 1000000)} млн`
    : null;
  const heroRevenue = (filmInfoId as any)?.fees?.world?.value
    ? `$${Math.round((filmInfoId as any).fees.world.value / 1000000)} млн`
    : null;
  const heroCompanies: string[] = (filmInfoId as any)?.productionCompanies || [];
  const stills: string[] = (((filmInfoId as any)?.stills || []) as string[]).slice(0, 12);

  // подробности фильма — вынесены из херо в отдельный раздел внизу
  const details = ([
    heroDirector ? { label: "Режиссёр", value: heroDirector } : null,
    heroCast.length ? { label: "В ролях", value: heroCast.join(", ") } : null,
    filmInfoId?.year ? { label: "Год", value: String(filmInfoId.year) } : null,
    filmInfoId?.movieLength ? { label: "Длительность", value: `${filmInfoId.movieLength} мин` } : null,
    heroBudget ? { label: "Бюджет", value: heroBudget } : null,
    heroRevenue ? { label: "Сборы", value: heroRevenue } : null,
    heroCompanies.length ? { label: "Студии", value: heroCompanies.join(", ") } : null,
    countries.length ? { label: "Страна", value: countries.map((country: any) => country.name).join(", ") } : null,
    genres.length ? { label: "Жанры", value: genres.map((genre: any) => genre.name).join(", ") } : null,
    ((filmInfoId as any)?.spokenLanguages || []).length
      ? { label: "Языки", value: ((filmInfoId as any).spokenLanguages as string[]).join(", ") }
      : null,
  ].filter(Boolean) as { label: string; value: string }[]);
  const [resolution, setResolution] = React.useState<any>({
    width: 0,
    height: 0,
  });

  const [value, setValue] = React.useState("one");
  // трейлер открывается модальным окном поверх страницы, а не новой вкладкой
  const [trailerOpen, setTrailerOpen] = React.useState(false);
  // описание: показываем кнопку «Читать полностью» только если текст обрезан
  const [descriptionOpen, setDescriptionOpen] = React.useState(false);
  const [descriptionClamped, setDescriptionClamped] = React.useState(false);
  const [stillIndex, setStillIndex] = React.useState<number | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);

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

  // закладка: состояние общее для всего сайта, без отдельного запроса
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(id);

  useEffect(() => {
    dispatch(getFilmById(id));
  }, [id]);

  useEffect(() => {
    refDataFilm.current?.setAttribute("data-kinopoisk", `${id}`);
  }, [id, resolution.width]);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element) return;

    const check = () => {
      // если описание уже развёрнуто, кнопку прятать не нужно
      if (descriptionOpen) return;
      setDescriptionClamped(element.scrollHeight - element.clientHeight > 4);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [filmInfoId?.description, descriptionOpen]);

  ///////////////////////////////////////
  //////////////////////////////////////
  const [token, setToken] = useState(null);
  // При локальной разработке Cloudflare Turnstile не нужен
  // Turnstile убран: проверка ботов отключена по решению владельца сайта
  const isVerified = true;

 /*  useEffect(() => {
    setIsVerified(false); // Reset verification status when component mounts
    setToken(null); // Reset token when component mounts
  }, [id]); */


///////////////////////////////////////
  //////////////////////////////////////

  // Скелетон — раньше всех проверок. Ширина окна измеряется в useEffect и
  // сначала равна нулю, поэтому на старте успевала отрисоваться мобильная
  // версия (старая раскладка с рейтингом 0) даже на компьютере.

  if (loading || !filmInfoId?.name) return <FilmSkeleton />;

  if (resolution.width < 850) {
    return (
      <>
    {(
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
    {(
    <Wrapper key={id}>
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
            {filmInfoId?.slogan ? (
              <HeroSlogan>«{filmInfoId.slogan}»</HeroSlogan>
            ) : null}
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
                onClick={() => {
                  document
                    .getElementById("fh-player")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  // сообщаем трекеру, что пользователь собрался смотреть
                  window.dispatchEvent(new Event("fh:watch-start"));
                }}
              >
                ▶ Смотреть
              </HeroButton>
              {filmInfoId?.videos?.trailers?.[0] ? (
                <HeroButton type="button" onClick={() => setTrailerOpen(true)}>
                  Трейлер
                </HeroButton>
              ) : null}
              <SaveFilmButton
                type="button"
                $active={saved}
                title={saved ? 'Убрать из сохранённого' : 'Сохранить на потом'}
                onClick={() => toggle(id)}
              >
                <BookmarkIcon viewBox="0 0 24 24" $active={saved}>
                  <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                </BookmarkIcon>
                {saved ? 'Сохранено' : 'Сохранить'}
              </SaveFilmButton>
            </HeroButtons>
            <ResumeHint filmId={id} />
            {filmInfoId?.description ? (
              <>
                <HeroDescription
                  ref={descriptionRef}
                  $expanded={descriptionOpen}
                  itemProp="description"
                >
                  {filmInfoId.description}
                </HeroDescription>
                {descriptionClamped || descriptionOpen ? (
                  <HeroMore
                    type="button"
                    onClick={() => setDescriptionOpen((open) => !open)}
                  >
                    {descriptionOpen ? "Свернуть" : "Читать полностью"}
                  </HeroMore>
                ) : null}
              </>
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
              {/* мост к встроенному плееру: пишет позицию в нашу базу */}
              <PlayerBridge filmId={id} />
              <WatchTracker filmId={id} />
              {/* <div key={id + id} className={s.film} ref={refDataFilm} id="yohoho" data-tv="1" ></div> */}
              {/* <div key={id} ref={refDataFilm} id='bazon' data-width='600' data-height='400'></div> */}
              {/* https://vid1648731340.vb17121coramclean.pw/play/${id}?d=filmhub.one */}
              {/* https://unsightly-lock.cdnmovies-stream.online/kinopoisk/${id}/iframe?domain=filmhub.one */}
              {streams ? (
                <StreamPlayer
                  filmId={id}
                  streams={streams}
                  poster={filmInfoId?.poster?.previewUrl}
                />
              ) : (
                <>
                  <Iframe sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups"
                  src={`https://api.ortified.ws/embed/kp/${id}`}
                  frameBorder="0"
                  scrolling="no"
                  allowFullScreen
                  referrerPolicy="origin"
                  width="500"
                  height="352"
                ></Iframe>
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
        {actors.length ? (
          <>
            <ActorsTitle>Актёры</ActorsTitle>
            <ActorsSlider
              cssMode={true}
              mousewheel={true}
              slidesPerView={4}
              slidesPerGroup={2}
              spaceBetween={10}
              modules={[Navigation, Mousewheel]}
              className="mySwiper"
              speed={500}
              navigation
              breakpoints={{
                577: { slidesPerGroup: 3, slidesPerView: 5, spaceBetween: 15 },
                769: { slidesPerGroup: 3, slidesPerView: 6, spaceBetween: 20 },
                1024: { slidesPerGroup: 4, slidesPerView: 7, spaceBetween: 24 },
                1200: { slidesPerGroup: 4, slidesPerView: 8, spaceBetween: 28 },
              }}
            >
              <ActorsWrapper>
                {actors.map((person: any) => (
                  <SwiperSlide key={`${person.id}-${person.name}`}>
                    <ActorsSlide>
                      <ActorCard>
                        <ActorPhoto>
                          <img src={person.photo} alt={person.name} loading="lazy" />
                        </ActorPhoto>
                        <ActorName>{person.name}</ActorName>
                        {person.description ? (
                          <ActorRole>{person.description}</ActorRole>
                        ) : null}
                      </ActorCard>
                    </ActorsSlide>
                  </SwiperSlide>
                ))}
              </ActorsWrapper>
            </ActorsSlider>
          </>
        ) : null}

        {stills.length ? (
          <>
            <ActorsTitle>Кадры из фильма</ActorsTitle>
            <ActorsSlider
              cssMode={true}
              mousewheel={true}
              slidesPerView={1.4}
              slidesPerGroup={1}
              spaceBetween={12}
              modules={[Navigation, Mousewheel]}
              className="mySwiper"
              speed={500}
              navigation
              breakpoints={{
                577: { slidesPerGroup: 2, slidesPerView: 2, spaceBetween: 16 },
                769: { slidesPerGroup: 2, slidesPerView: 2.6, spaceBetween: 18 },
                1024: { slidesPerGroup: 3, slidesPerView: 3.2, spaceBetween: 20 },
                1200: { slidesPerGroup: 3, slidesPerView: 4, spaceBetween: 22 },
              }}
            >
              <ActorsWrapper>
                {stills.map((src, index) => (
                  <SwiperSlide key={src}>
                    <ActorsSlide>
                      <StillCard onClick={() => setStillIndex(index)}>
                        <img src={src} alt="" loading="lazy" />
                      </StillCard>
                    </ActorsSlide>
                  </SwiperSlide>
                ))}
              </ActorsWrapper>
            </ActorsSlider>
          </>
        ) : null}

        {details.length ? (
          <DetailsSection>
            <ActorsTitle>Детали</ActorsTitle>
            <DetailsGrid>
              {details.map((item) => (
                <DetailsRow key={item.label}>
                  <DetailsLabel>{item.label}</DetailsLabel>
                  <DetailsValue>{item.value}</DetailsValue>
                </DetailsRow>
              ))}
            </DetailsGrid>
          </DetailsSection>
        ) : null}

        {/* музыка из фильма: альбом из Wikidata, треклист из MusicBrainz */}
        <SoundtrackSection
          kpId={id}
          title={filmInfoId?.name || ""}
          originalTitle={filmInfoId?.enName || filmInfoId?.alternativeName || ""}
          year={filmInfoId?.year || ""}
        />

        <Bottom />
      </LayoutFilm>

      {stillIndex !== null && stills[stillIndex] ? (
        <StillOverlay onClick={() => setStillIndex(null)}>
          <CloseIconTrailer sidebar={+true} onClick={() => setStillIndex(null)}>
            <Line1 />
            <Line2 />
          </CloseIconTrailer>
          <BigStill
            src={stills[stillIndex]}
            alt=""
            onClick={(event) => event.stopPropagation()}
            style={{ cursor: "default" }}
          />
        </StillOverlay>
      ) : null}

      {trailerOpen && filmInfoId?.videos?.trailers?.[0] ? (
        <Overlay data-trailer-open="true" onClick={() => setTrailerOpen(false)}>
          <CloseIconTrailer
            sidebar={+true}
            onClick={() => setTrailerOpen(false)}
          >
            <Line1 />
            <Line2 />
          </CloseIconTrailer>
          <IframeTrailer
            src={filmInfoId?.videos?.trailers?.[0].url}
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="origin"
          />
          {/* YouTube может показать проверку «подтвердите, что вы не бот» —
              встроенное видео тогда не играет. Даём прямой путь посмотреть. */}
          <a
            href={
              (filmInfoId?.videos?.trailers?.[0] as any).watchUrl ||
              `https://www.youtube.com/watch?v=${
                String(filmInfoId?.videos?.trailers?.[0].url).split("/embed/")[1]?.split("?")[0] || ""
              }`
            }
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            style={{
              position: "absolute",
              bottom: "26px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 12,
              padding: "10px 18px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.12)",
              color: "#fff",
              fontSize: "14px",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Трейлер не играет? Открыть на YouTube →
          </a>
        </Overlay>
      ) : null}
    </Wrapper>
     )} 
    </>
  );
}
