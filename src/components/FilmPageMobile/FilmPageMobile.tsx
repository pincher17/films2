import React, { useEffect } from "react";
import LayoutFilm from "../layoutFilm/LayoutFilm";
import {
  ActorCard,
  ActorName,
  ActorPhoto,
  ActorRole,
  ActorsRow,
} from "../../app/styles/FilmPage.styles";
import SwiperFilms from "../SwiperFilms/SwiperFilms";
import {
  BackgroundImage,
  Bottom,
  ButtonWatch,
  Description,
  Gradient,
  ImgMainMobile,
  ImgWrapFilmMobile,
  ImgWrapperFilmMobile,
  MobileDescription,
  MobileDetailsLabel,
  MobileDetailsRow,
  MobileDetailsValue,
  MobileMore,
  MobileSectionTitle,
  MobileSeo,
  SwiperWrapperSimilar,
  TitleDescription,
  TrailerButtonWatch,
  Wrapper,
  WrapperInfo,
  WrapperWatchFilm,
} from "../../app/styles/FilmPageMobile.styles";
import FilmInfoText from "../FilmInfoText/FilmInfoText";
import MobileWatchFilm from "../MobileWatchFilm/MobileWatchFilm";
import SoundtrackSection from "../SoundtrackSection/SoundtrackSection";
import ResumeHint from "../ResumeHint/ResumeHint";
import TrailerMobileWatch from "../TrailerMobileWatch/TrailerMobileWatch";
import SkeletonImage from "../SkeletonImage/SkeletonImage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getFilmById } from "@/redux/filmInfoSlice";
import { Strong } from "@/app/styles/FilmPage.styles";
import translateCategory from "../helpers/translateCategory";

export default function FilmPageMobile({ params }: { params: { id: number } }) {
  let id = params.id
  const dispatch = useAppDispatch();
  const filmInfoId = useAppSelector((state) => state.filmInfo.info);
  const loading = useAppSelector(state => state.loading.loading);
  const { preview, countries, genres, ratingKinopoisk } = useAppSelector(
    (state) => state.filmInfo
  );
 
  const [resolution, setResolution] = React.useState<any>({
    width: 0,
    height: 0,
  });
  const [watchFilm, setWatchFilm] = React.useState<boolean>(false);
  const [watchTrailer, setWatchTrailer] = React.useState<boolean>(false);

  useEffect(() => {
    /*
     * Данные запрашивает родитель (FilmPage). Повторный запрос отсюда вызывал
     * бесконечный цикл: дочерний компонент монтируется → ставит loading → в
     * FilmPage срабатывает ранний возврат со скелетоном → дочерний компонент
     * размонтируется → загрузка завершается → он монтируется снова.
     * Запрашиваем только если данных действительно нет — на случай, если
     * компонент когда-нибудь откроют отдельно от FilmPage.
     */
    if (!filmInfoId?.name) dispatch(getFilmById(id));
  }, [id, filmInfoId?.name]);

  const watchFilmStart = () => setWatchFilm(true);
  const watchTrailerStart = () => setWatchTrailer(true);
  const [descOpen, setDescOpen] = React.useState(false);

  // Детали, которых на телефоне не было: их показывает только десктопная
  // версия, поэтому страница выглядела неполной
  const persons: any[] = ((filmInfoId as any)?.persons || []) as any[];
  const director = persons
    .filter((person) =>
      ["director", "Director", "Режиссер"].includes(person?.enProfession || person?.profession)
    )
    .map((person) => person.name)
    .slice(0, 2)
    .join(", ");
  const cast = persons
    .filter((person) => person?.enProfession === "actor")
    .map((person) => person.name)
    .slice(0, 4)
    .join(", ");
  // Актёры с фотографиями: на десктопе это лента, на телефоне она же,
  // но без swiper — горизонтальная прокрутка пальцем
  const actors = persons
    .filter((person: any) => person?.enProfession === "actor" && person?.photo)
    .slice(0, 20);

  const detailRows = [
    director ? { label: "Режиссёр", value: director } : null,
    cast ? { label: "В ролях", value: cast } : null,
    filmInfoId?.year ? { label: "Год", value: String(filmInfoId.year) } : null,
    filmInfoId?.movieLength
      ? { label: "Длительность", value: `${filmInfoId.movieLength} мин` }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Wrapper>
      {watchFilm && <MobileWatchFilm id={id} setWatchFilm={setWatchFilm} />}
      {watchTrailer && <TrailerMobileWatch id={id} setWatchTrailer={setWatchTrailer} src={`${filmInfoId?.videos.trailers[0].url}`} />}
      <LayoutFilm>
        <Gradient>
        <BackgroundImage src={filmInfoId?.poster.previewUrl} />
        </Gradient>
       
        <WrapperInfo>
          <WrapperWatchFilm>
            <div>
              {loading ? <SkeletonImage /> 
              : <ImgWrapperFilmMobile>
                  <ImgWrapFilmMobile>
                    <ImgMainMobile src={filmInfoId?.poster.previewUrl} alt={filmInfoId?.name} />
                  </ImgWrapFilmMobile>
                </ImgWrapperFilmMobile>
          }
            </div>
            <FilmInfoText
              countries={countries}
              filmInfoId={filmInfoId}
              genres={genres}
              ratingKinopoisk={ratingKinopoisk}
              resolution={resolution}
            />
          </WrapperWatchFilm>
        </WrapperInfo>
        <ResumeHint filmId={id} />
        <ButtonWatch onClick={watchFilmStart}>Смотреть</ButtonWatch>
        {filmInfoId?.videos && filmInfoId?.videos.trailers[0] ? <TrailerButtonWatch onClick={watchTrailerStart}>Трейлер</TrailerButtonWatch> : ''}
        <MobileSeo>Смотреть онлайн {filmInfoId?.type && translateCategory(filmInfoId.type)} {filmInfoId?.name} {filmInfoId?.year} года в хорошем качестве</MobileSeo>
        <MobileSectionTitle>Описание</MobileSectionTitle>
        <MobileDescription $open={descOpen}>{filmInfoId?.description}</MobileDescription>
        {filmInfoId?.description && filmInfoId.description.length > 260 ? (
          <MobileMore
            $open={descOpen}
            onClick={() => setDescOpen((prev) => !prev)}
          >
            {descOpen ? "Свернуть" : "Читать полностью"}
            <svg width="12" height="7" viewBox="0 0 12 7" aria-hidden="true">
              <path
                d="M1 1l5 5 5-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MobileMore>
        ) : null}

        {filmInfoId?.similarMovies && filmInfoId?.similarMovies.length ? (
          <MobileSectionTitle>Похожие</MobileSectionTitle>
        ) : null}
        <SwiperWrapperSimilar>
          {filmInfoId?.similarMovies && filmInfoId?.similarMovies.length ? (
            <>
              <SwiperFilms cards={filmInfoId?.similarMovies} />
            </>
          ) : (
            ""
          )}
        </SwiperWrapperSimilar>

        {detailRows.length ? (
          <>
            <MobileSectionTitle>Детали</MobileSectionTitle>
            {detailRows.map((row) => (
              <MobileDetailsRow key={row.label}>
                <MobileDetailsLabel>{row.label}</MobileDetailsLabel>
                <MobileDetailsValue>{row.value}</MobileDetailsValue>
              </MobileDetailsRow>
            ))}
          </>
        ) : null}

        {actors.length ? (
          <>
            <MobileSectionTitle>В ролях</MobileSectionTitle>
            <ActorsRow>
              {actors.map((person: any) => (
                <ActorCard key={`${person.id}-${person.name}`}>
                  <ActorPhoto>
                    <img src={person.photo} alt={person.name} loading="lazy" />
                  </ActorPhoto>
                  <ActorName>{person.name}</ActorName>
                  {person.description ? (
                    <ActorRole>{person.description}</ActorRole>
                  ) : null}
                </ActorCard>
              ))}
            </ActorsRow>
          </>
        ) : null}
        {filmInfoId?.sequelsAndPrequels && filmInfoId?.sequelsAndPrequels.length ? (
          <MobileSectionTitle>Сиквелы и приквелы</MobileSectionTitle>
        ) : null}
        <SwiperWrapperSimilar>
          {filmInfoId?.sequelsAndPrequels && filmInfoId?.sequelsAndPrequels.length ? (
            <>
              <SwiperFilms cards={filmInfoId?.sequelsAndPrequels} />
            </>
          ) : (
            ""
          )}
        </SwiperWrapperSimilar>

        <SoundtrackSection
          kpId={id}
          title={filmInfoId?.name}
          originalTitle={filmInfoId?.enName || filmInfoId?.alternativeName}
          year={filmInfoId?.year}
        />
        <Bottom />
      </LayoutFilm>
    </Wrapper>
  );
};
