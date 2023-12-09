import React from 'react';
import { Img, ImgWrap, ImgWrapper, NameFilm, Rating, RatingNum, Wrapper, Year } from '../../app/styles/Card.styles';
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

  let ratingKp

  if(rating){
    ratingKp = roundNumber(rating.kp, 1)
  }

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
            <Rating>
                <RatingNum>{ratingKp}</RatingNum>
            </Rating>}
            <NameFilm title={name}>{name}</NameFilm>
            <Year>{year}</Year>
            </ImgWrapper>
            </Link>
    </Wrapper>
    )
}

export default Card;