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
            </ImgWrap>
            {ratingKp &&
            <Rating $tier={ratingTier}>
                <RatingNum>{ratingKp}</RatingNum>
            </Rating>}
            {progress && typeof progress.percent === "number" ? (
              <ProgressTrack>
                <ProgressFill $percent={progress.percent} />
              </ProgressTrack>
            ) : null}
            <NameFilm title={name}>{name}</NameFilm>
            <Year>{year}</Year>
            {progress && progress.season && progress.episode ? (
              <EpisodeLabel>
                Сезон {progress.season} · Серия {progress.episode}
              </EpisodeLabel>
            ) : null}
            </ImgWrapper>
            </Link>
    </Wrapper>
    )
}

export default Card;