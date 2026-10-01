'use client'

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useRef, useState } from 'react';
import { Button,NameBlock, Wrapper, WrapperButtonShowMore, WrapperNameBlock } from '../../../src/app/styles/AllFilmsPage.styles';
import Cards from '@/components/Cards/Cards';
import { MainTag } from '@/app/Main.styles';
import { getFilmsSlugFirstThunk, getFilmsSlugThunk, nextPage, setNameCollection, setPage } from '@/redux/Collection';
import InfiniteScroll from '@/components/InfiniteScroll';

export default function CollectionPage({ params }: { params: { slug: string } }){
  let slug = params.slug
  const films = useAppSelector(state => state.collection.films);
  const nameCollection = useAppSelector(state => state.collection.nameCollection);
  const nameCollectionRussian = useAppSelector(state => state.collection.nameCollectionRussian);
  const page = useAppSelector(state => state.collection.page);
  const allPages = useAppSelector(state => state.collection.allPages);
  const dispatch = useAppDispatch()
  // автоподгрузка: стоп, когда новых карточек не пришло
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const prevCount = useRef(0);



      useEffect(() => {
        if(slug !== nameCollection){
            dispatch(setPage(1))
            dispatch(setNameCollection(slug))
            console.log('first');
            dispatch(getFilmsSlugFirstThunk(slug, 1));
        }else{
            return
        }
  }, []);


  useEffect(() => {
    if (films.length > prevCount.current) {
      prevCount.current = films.length;
      setAllLoaded(false);
    } else if (films.length > 0 && films.length === prevCount.current) {
      setAllLoaded(true);
    }
  }, [films]);

      const showMore = () => {
        dispatch(nextPage())
        dispatch(getFilmsSlugThunk(slug, page + 1));
      };
      
  
  return (
   <>
    <MainTag>
    <Wrapper>
      <WrapperNameBlock>
        <div>
          <NameBlock>{nameCollectionRussian}</NameBlock>
        </div>
      </WrapperNameBlock>
      <Cards cards={films} />
     <InfiniteScroll
       count={films.length}
       onLoad={showMore}
       disabled={allLoaded || page >= allPages}
     />
     <WrapperButtonShowMore>
     {page >= allPages ? '' :<Button onClick={showMore}>Показать еще</Button>}
      </WrapperButtonShowMore>
    </Wrapper>
    </MainTag>
    </>
  )


}

