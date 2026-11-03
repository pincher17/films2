import React from 'react';
import Card from '../Card';
import { Wrapper } from '../../app/styles/Cards.styles';
import { CardsProps } from './Cards.types';
import SkeletonCard from '../SkeletonCard/SkeletonCard';
import { useAppSelector } from '@/redux/hooks';


const Cards: React.FC<CardsProps> = (props) =>{
    const loading = useAppSelector((state: { loading: { loading: any; }; }) => state.loading.loading);
    const arraySkeletonCards = [1,2,3,4,5,6,7,8,9,10];
    const loadingFilters = useAppSelector(state => state.loading.loadingFilters);

    // заглушки показываем и по флагам redux (каталог), и по флагу из props:
    // у страниц со своим состоянием загрузки (например «Сохранённое») redux занят
    const showSkeleton = loadingFilters || Boolean(props.loading);

    return (
    <Wrapper>
        {showSkeleton
        ? arraySkeletonCards.map((index)=>
        <SkeletonCard key={index} />
       )
        : props.cards.map((item: any)=>
         <Card key={item.id} card={item} onRemove={props.onRemove} hideSave={Boolean(props.onRemove)} />
        )}
        {!showSkeleton && loading && arraySkeletonCards.map((index)=>
         <SkeletonCard key={index} />
        )}
    </Wrapper>
    )
}

export default Cards;
