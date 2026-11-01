import React from 'react';
import {
  Img,
  ImgWrap,
  ImgWrapper,
  NameFilm,
  ProgressFill,
  OverlayText,
  PosterOverlay,
  ProgressTrack,
  Rating,
  RatingNum,
  ResumeBadge,
  SaveButton,
  BookmarkIcon,
  Wrapper,
  Year,
} from '../../app/styles/Card.styles';
import { CardProps } from './Card.types';
import roundNumber from '../helpers/rounding';
import textTransform from '../helpers/textTransform';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSaved } from '../SavedProvider/SavedProvider';


const Card: React.FC<CardProps> = (props) =>{
    
const {
    id,
    poster,
    name,
    year,
    rating
  } = props.card

  const router = useRouter();
  /* Крестик удаления — как в ряду «Продолжить просмотр» на главной */
  const onRemove = (props as { onRemove?: (card: any) => void }).onRemove;
  /* Адрес страницы фильма: нужен и ссылке, и предзагрузке */
  const href = name
    ? `/film/${id}-${textTransform(name)}${year ? "-" + year : ""}`
    : `/film/${id}`;

  /**
   * Время, на котором остановился просмотр, в виде таймкода:
   * для фильма «1:31:44», для серии «12:34».
   */
  const positionText = (() => {
    const seconds = (props.card as { progress?: { seconds?: number } }).progress?.seconds;
    if (typeof seconds !== "number" || seconds <= 0) return null;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const rest = Math.floor(seconds % 60);
    const mm = String(minutes).padStart(hours ? 2 : 1, "0");
    const ss = String(rest).padStart(2, "0");

    return hours ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
  })();

  // Прогресс приходит только из ряда «Продолжить просмотр»: у остальных карточек
  // этого поля нет, поэтому полоска нигде больше не появляется
  const progress = (props.card as { progress?: { percent?: number | null; season?: number; episode?: number } })
    .progress;

  /** Подпись на постере: серия и время, на котором остановился просмотр */
  const overlayText = [
    progress && progress.season && progress.episode
      ? `Сезон ${progress.season}, серия ${progress.episode}`
      : null,
    positionText,
  ]
    .filter(Boolean)
    .join(" · ");


  // сохранён ли этот фильм: берём из общего состояния, без запроса на карточку
  const { isSaved, toggle } = useSaved();
  const saved = id ? isSaved(id) : false;

  let ratingKp

  if(rating){
    ratingKp = roundNumber(rating.kp, 1)
  }

  // ступень рейтинга для цвета бейджа
  const ratingTier = !ratingKp
    ? "none"
    : ratingKp >= 8
    ? "top"
    : ratingKp >= 7
    ? "good"
    : ratingKp >= 6
    ? "mid"
    : ratingKp >= 5
    ? "weak"
    : "low";

    return (
    <Wrapper key={id}>
            <Link
              href={href}
              /* Next не предзагружает страницы, которые рендерятся на сервере
                 с данными. Поэтому начинаем загрузку при наведении — к клику
                 страница уже готова и открывается мгновенно. */
              onMouseEnter={() => router.prefetch(href)}
              onTouchStart={() => router.prefetch(href)}
            >
            <ImgWrapper>
            <ImgWrap>
            {poster?.url 
            && <Img
             src={poster.previewUrl} 
             alt={name} /* 
             sizes="100%"
            fill
            quality={80} */
             />}
            {progress && typeof progress.percent === "number" ? (
              <>
                <ProgressTrack>
                  <ProgressFill $percent={progress.percent} />
                </ProgressTrack>
                {overlayText ? (
                  <PosterOverlay>
                    <ResumeBadge title="Продолжить просмотр">
                      {/* треугольник воспроизведения: читается как «продолжить» */}
                      <svg width="12" height="14" viewBox="0 0 10 12" aria-hidden="true">
                        <path
                          d="M1 1.1c0-.8.86-1.28 1.54-.87l6.4 3.9c.66.4.66 1.34 0 1.74l-6.4 3.9C1.86 10.18 1 9.7 1 8.9V1.1z"
                          fill="currentColor"
                        />
                      </svg>
                    </ResumeBadge>
                    <OverlayText>{overlayText}</OverlayText>
                  </PosterOverlay>
                ) : null}
              </>
            ) : null}
            </ImgWrap>
            {ratingKp &&
            <Rating $tier={ratingTier}>
                <RatingNum>{ratingKp}</RatingNum>
            </Rating>}
            <NameFilm title={name}>{name}</NameFilm>
            <Year>{year}</Year>

            </ImgWrapper>
            </Link>
            {onRemove && (
              <button
                type="button"
                title="Убрать из «Продолжить просмотр»"
                aria-label="Убрать из «Продолжить просмотр»"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 5,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  background: "rgba(0,0,0,0.65)",
                  color: "#fff",
                  fontSize: 16,
                  lineHeight: 1,
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onRemove(props.card);
                }}
              >
                ✕
              </button>
            )}
            {id && !props.hideSave ? (
              <SaveButton
                type="button"
                className="fh-save"
                aria-label={saved ? 'Убрать из сохранённого' : 'Сохранить на потом'}
                title={saved ? 'Убрать из сохранённого' : 'Сохранить на потом'}
                onClick={(event) => {
                  // карточка целиком — ссылка, поэтому гасим переход
                  event.preventDefault();
                  event.stopPropagation();
                  toggle(id);
                }}
              >
                <BookmarkIcon viewBox="0 0 24 24" $active={saved}>
                  <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                </BookmarkIcon>
              </SaveButton>
            ) : null}
    </Wrapper>
    )
}

export default Card;