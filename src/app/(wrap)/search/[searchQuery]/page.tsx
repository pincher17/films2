import type { Metadata } from 'next';
import SearchPage from '@/components/searchPage/SearchPage';

/* Страницы выдачи не индексируем: это динамические списки, иначе в поиске
   появились бы тысячи почти одинаковых адресов. */
export const metadata: Metadata = {
  title: 'Поиск по каталогу — Filmhub',
  robots: { index: false, follow: true },
};
 
type Props = {
  params: { searchQuery: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 

export default function Search({ params }: { params: { searchQuery: string } }) {

  let searchQuery = params.searchQuery

  return (
   <>
      <SearchPage params={{
        searchQuery
      }} />
    </>
  )
}
