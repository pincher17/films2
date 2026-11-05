import { BookmarkIcon } from '@/app/styles/Card.styles';
import { useSaved } from '@/components/SavedProvider/SavedProvider';
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
  WatchRow,
  SaveSquareButton,
  IconActions,
  IconAction,
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
import Seasons from "../Seasons/Seasons";
import MobileWatchFilm from "../MobileWatchFilm/MobileWatchFilm";
import SoundtrackSection from "../SoundtrackSection/SoundtrackSection";
import ResumeHint from "../ResumeHint/ResumeHint";
import TrailerMobileWatch from "../TrailerMobileWatch/TrailerMobileWatch";
import SkeletonImage from "../SkeletonImage/SkeletonImage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getFilmById } from "@/redux/filmInfoSlice";
import { Strong } from "@/app/styles/FilmPage.styles";
import translateCategory from "../helpers/translateCategory";

export default function FilmPageMobile({ params }: { params: { id: number | string } }) {
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

  // закладка: состояние общее для всего сайта, без отдельного запроса
  // «Поделиться»: на телефоне вызываем системное меню, иначе копируем ссылку
  const shareFilm = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = filmInfoId?.name || "Filmhub";

    // 1. системное меню телефона — доступно только на https или localhost
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title, url });
        return;
      }
    } catch {
      // человек закрыл меню — это не ошибка
      return;
    }

    // 2. буфер обмена — тоже требует защищённого соединения
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        alert("Ссылка скопирована");
        return;
      }
    } catch {
      undefined;
    }

    // 3. запасной путь: работает всегда, в том числе на локальном адресе
    window.prompt("Скопируйте ссылку:", url);
  };

  const { isSaved, toggle } = useSaved();
  const saved = isSaved(id);

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

  /* Плеер и история просмотра работают с числовым id: для imdb-адреса
     берём число из него самого, чтобы запись не потерялась */
  /* Для imdb-адресов берём отрицательное число: история и сохранённое
       хранятся числом, и так они не пересекутся с кинопоисковыми id */
  const imdbNumber = (() => {
    const raw = String(id ?? "");
    const clean = raw.match(/^tt\d+/i)?.[0];
    return clean ? -Number(clean.replace(/\D/g, "")) : 0;
  })();

  const numericFilmId = imdbNumber || Number(String(id).replace(/\D/g, "")) || 0;

  return (
    <Wrapper>
      {watchFilm && <MobileWatchFilm id={numericFilmId} setWatchFilm={setWatchFilm} />}
      {watchTrailer && <TrailerMobileWatch id={numericFilmId} setWatchTrailer={setWatchTrailer} src={`${filmInfoId?.videos?.trailers?.[0].url}`} />}
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
        <ResumeHint filmId={numericFilmId} />
        <ButtonWatch onClick={watchFilmStart}>Смотреть</ButtonWatch>

        <IconActions>
          <IconAction
            type="button"
            aria-label={saved ? 'Убрать из сохранённого' : 'Сохранить на потом'}
            onClick={() => toggle(id)}
          >
            <span className="circle">
              <BookmarkIcon viewBox="0 0 24 24" $active={saved}>
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
              </BookmarkIcon>
            </span>
            <span className="label">{saved ? 'В сохранённом' : 'Сохранить'}</span>
          </IconAction>

          {filmInfoId?.videos && filmInfoId?.videos?.trailers?.[0] ? (
            <IconAction type="button" onClick={watchTrailerStart}>
              <span className="circle">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5-11-6.5z" fill="#fff" />
                </svg>
              </span>
              <span className="label">Трейлер</span>
            </IconAction>
          ) : null}

          <IconAction type="button" onClick={shareFilm}>
            <span className="circle">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 15V4m0 0L8 8m4-4l4 4M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="label">Поделиться</span>
          </IconAction>
        </IconActions>
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

        {filmInfoId?.seasons && filmInfoId.seasons.length ? (
          <>
            <MobileSectionTitle>Сезоны</MobileSectionTitle>
            <Seasons seasons={filmInfoId.seasons} />
          </>
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
