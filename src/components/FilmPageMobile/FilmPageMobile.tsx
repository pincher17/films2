import React, { useEffect } from "react";
import LayoutFilm from "../layoutFilm/LayoutFilm";
import SwiperFilms from "../SwiperFilms/SwiperFilms";
import {
  Bottom,
  ButtonWatch,
  Description,
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
import TrailerMobileWatch from "../TrailerMobileWatch/TrailerMobileWatch";
import SkeletonImage from "../SkeletonImage/SkeletonImage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getFilmById } from "@/redux/filmInfoSlice";

export default function FilmPageMobile({ params }: { params: { id: number } }) {
  let id = params.id
  const dispatch = useAppDispatch();
  const filmInfoId = useAppSelector((state) => state.filmInfo.info);
  const loading = useAppSelector(state => state.loading.loading);
  const { preview, countries, genres, ratingKinopoisk } = useAppSelector(
    (state) => state.filmInfo
  );
  /* const refDataFilm = useRef<HTMLInputElement | null>(null); */
  const [resolution, setResolution] = React.useState<any>({
    width: 0,
    height: 0,
  });
  const [watchFilm, setWatchFilm] = React.useState<boolean>(false);
  const [watchTrailer, setWatchTrailer] = React.useState<boolean>(false);

  useEffect(() => {
    dispatch(getFilmById(id));
  }, [id]);

  const watchFilmStart = () => setWatchFilm(true);
  const watchTrailerStart = () => setWatchTrailer(true);

  return (
    <Wrapper>
      {watchFilm && <MobileWatchFilm id={id} setWatchFilm={setWatchFilm} />}
      {watchTrailer && <TrailerMobileWatch id={id} setWatchTrailer={setWatchTrailer} src={`${filmInfoId?.videos.trailers[0].url}`} />}
      <LayoutFilm>
        <WrapperInfo>
          <WrapperWatchFilm>
            <div>
              {loading ? <SkeletonImage /> 
              : <ImgWrapperFilmMobile>
                  <ImgWrapFilmMobile>
                    <ImgMainMobile src={preview} alt={filmInfoId?.name} />
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
        <ButtonWatch onClick={watchFilmStart}>Смотреть</ButtonWatch>
        {filmInfoId?.videos && filmInfoId?.videos.trailers[0] ? <TrailerButtonWatch onClick={watchTrailerStart}>Трейлер</TrailerButtonWatch> : ''}
        <TitleDescription>Описание:</TitleDescription>
        <Description>{filmInfoId?.description}</Description>

        <SwiperWrapperSimilar>
          {filmInfoId?.similarMovies.length ? (
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
