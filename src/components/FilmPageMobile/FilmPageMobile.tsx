import React, { useEffect } from "react";
import LayoutFilm from "../layoutFilm/LayoutFilm";
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
  const details = [
    director ? `Режиссёр: ${director}` : null,
    cast ? `В ролях: ${cast}` : null,
    filmInfoId?.year ? `Год: ${filmInfoId.year}` : null,
    filmInfoId?.movieLength ? `Длительность: ${filmInfoId.movieLength} мин` : null,
  ].filter(Boolean) as string[];

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
        <Strong>Смотреть онлайн {filmInfoId?.type && translateCategory(filmInfoId.type)} {filmInfoId?.name} {filmInfoId?.year} года в хорошем качестве</Strong>
        <TitleDescription>Описание:</TitleDescription>
        <Description>{filmInfoId?.description}</Description>

        {details.length ? (
          <>
            <TitleDescription>Детали:</TitleDescription>
            {details.map((line) => (
              <Description key={line}>{line}</Description>
            ))}
          </>
        ) : null}

        <SoundtrackSection
          kpId={id}
          title={filmInfoId?.name}
          originalTitle={filmInfoId?.enName || filmInfoId?.alternativeName}
          year={filmInfoId?.year}
        />
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
};
