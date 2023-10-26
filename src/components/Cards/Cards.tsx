import React from 'react';
import Card from '../Card';
import { Wrapper } from '../../app/styles/Cards.styles';
import { CardsProps } from './Cards.types';
import SkeletonCard from '../SkeletonCard/SkeletonCard';
import { useAppSelector } from '@/redux/hooks';


const Cards: React.FC<CardsProps> = (props) =>{
    const loading = useAppSelector((state: { loading: { loading: any; }; }) => state.loading.loading);
    const arraySkeletonCards = [1,2,3,4,5,6,7,8,9,10];


    return (
    <Wrapper>
        {props.cards.map((item: any)=>
         <Card key={item.id} card={item} />
        )}
        {loading && arraySkeletonCards.map((index)=>
         <SkeletonCard key={index} />
        )}
    </Wrapper>
    )
}

export default Cards;
