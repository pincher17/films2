import React from 'react';
import { Img, ImgWrap, ImgWrapper, NameFilm, Wrapper } from '../../app/styles/Card.styles';
import Link from 'next/link';
import { CardCollectionProps } from './CardCollection.types';
import { ImageCollection, NameCollection } from '@/app/styles/CardCollection.styles';


const CardCollection: React.FC<CardCollectionProps> = (props) =>{
    
const {
    id,
    slug,
    cover,
    name
  } = props.CardCollection


    return (
    <Wrapper key={id}>
            <Link href={`/collection/${slug}`}>
            <ImgWrapper>
            <ImgWrap>
            <ImageCollection
             src={cover.url} 
             alt={name} 
             />
            </ImgWrap>
            <NameCollection title={name}>{name}</NameCollection>
            </ImgWrapper>
            </Link>
    </Wrapper>
    )
}

export default CardCollection;