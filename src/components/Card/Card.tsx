import React from 'react';
import {
  EpisodeLabel,
  Img,
  ImgWrap,
  ImgWrapper,
  NameFilm,
  ProgressFill,
  ProgressTrack,
  Rating,
  RatingNum,
  ResumeBadge,
  Wrapper,
  Year,
} from '../../app/styles/Card.styles';
import { CardProps } from './Card.types';
import roundNumber from '../helpers/rounding';
import textTransform from '../helpers/textTransform';
import Link from 'next/link';


const Card: React.FC<CardProps> = (props) =>{
    
const {
    id,
    poster,
    name,
    year,
    rating
  } = props.card

  /**
   * Сколько осталось смотреть. Приём, который используют Netflix и Apple:
   * без остатка подпись «Сезон 1, серия 8» читается как описание сериала,
   * а с остатком однозначно говорит «ты остановился здесь».
   */
  const remainingText = (() => {
    const p = (props.card as { progress?: { seconds?: number; duration?: number | null } }).progress;
    if (!p?.duration || typeof p.seconds !== "number") return null;
    const left = Math.max(0, p.duration - p.seconds);
    if (left < 60) return "меньше минуты";
    const hours = Math.floor(left / 3600);
    const minutes = Math.round((left % 3600) / 60);
    return hours ? `${hours} ч ${minutes} мин` : `${minutes} мин`;
  })();

  // Прогресс приходит только из ряда «Продолжить просмотр»: у остальных карточек
  // этого поля нет, поэтому полоска нигде больше не появляется
  const progress = (props.card as { progress?: { percent?: number | null; season?: number; episode?: number } })
    .progress;

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
            <Link href={name ? `/film/${id}-${textTransform(name)}${year ? '-'+year : ''}` : `/film/${id}`}>
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
                {/* значок паузы: «ты остановился здесь» */}
                <ResumeBadge title="Вы остановились здесь">
                  <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
                    <rect x="0" y="0" width="3.2" height="12" rx="1.2" fill="currentColor" />
                    <rect x="6.8" y="0" width="3.2" height="12" rx="1.2" fill="currentColor" />
                  </svg>
                </ResumeBadge>
              </>
            ) : null}
            </ImgWrap>
            {ratingKp &&
            <Rating $tier={ratingTier}>
                <RatingNum>{ratingKp}</RatingNum>
            </Rating>}
            <NameFilm title={name}>{name}</NameFilm>
            <Year>{year}</Year>
            {progress && (progress.season || remainingText) ? (
              <EpisodeLabel>
                {[
                  progress.season && progress.episode
                    ? `Сезон ${progress.season}, серия ${progress.episode}`
                    : null,
                  remainingText ? `осталось ${remainingText}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </EpisodeLabel>
            ) : null}
            </ImgWrapper>
            </Link>
    </Wrapper>
    )
}

export default Card;