'use client'

import Cards from '../Cards/Cards';
import s from '../../app/styles/SearchPage.module.css';
import { MainTag } from '../../app/Main.styles';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import React, { useEffect, useState } from 'react';
import { getFilmSearchPage, refreshResultSearchPage } from '@/redux/searchSlice';


export default function SearchPage({ params }: { params: { searchQuery: string } }) {

  const resultSearch = useAppSelector(state => state.search.resultSearchPage)
  const totalFilms = useAppSelector(state => state.search.resultSearchTotal)
  const totalPages = useAppSelector(state => state.search.totalPages)
  const dispatch = useAppDispatch()
  let searchQuery = params.searchQuery
  const [page, setPage] = useState(1);
  const didMount = React.useRef(false);

  useEffect(() => {
    dispatch(refreshResultSearchPage())
    dispatch(getFilmSearchPage(searchQuery, 1))
  
    }, [searchQuery]);

    useEffect(() => {
        if (!didMount.current) {
            didMount.current = true;
            return;
          }
          dispatch(getFilmSearchPage(searchQuery, page))
      
        }, [page]);

    const showMore = () => setPage(page + 1)

console.log(page)
    return (
    <MainTag>
    <div className={s.wrapper}>
        <div className={s.wrapper_search_group}>
            <div className={s.search_group}>
            <div><p className={s.search_text}>{`Поиск по запросу: `}</p></div>
            <div><p className={s.search_text_query}>{`${decodeURI(searchQuery)}`}</p></div>
            </div>
            <div><p className={s.total_films}>{`Найдено: ${totalFilms}шт.`}</p></div>
        </div>
    {resultSearch.length && <Cards cards={resultSearch} />}
    {totalPages === page ? <></> : <div className={s.wrapper_btn_show_more}><button onClick={showMore} className={s.btn}>Показать еще</button></div>}
    </div>
    </MainTag>
    )
}
