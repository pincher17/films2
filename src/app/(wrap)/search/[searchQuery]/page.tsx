

import Header from '@/components/Header/Header';
import SearchPage from '@/components/searchPage/SearchPage';
 
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
