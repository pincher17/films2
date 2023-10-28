import FilmPage from '@/components/FilmPage/FilmPage';
import type { Metadata, ResolvingMetadata } from 'next'
import { filmsApi } from '@/api/api';
import translateCategory from '@/components/helpers/translateCategory';
import roundNumber from '@/components/helpers/rounding';
 
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id
 
  // fetch data
  const response = await filmsApi.getFilmById(id)

  const filmInfoId = response.data;
 
 
  return {
    title: `${filmInfoId.name} ${filmInfoId.year} г. - смотреть онлайн на Filmhub`,
    description: `Смотрите онлайн ${translateCategory(filmInfoId.type)} ${filmInfoId.name} (${filmInfoId.year}) года в хорошем качестве HD, рейтинг кинопоиска: ${roundNumber(filmInfoId.rating.kp, 1)}`,
    keywords: [`${filmInfoId.name}`, `${filmInfoId.year}`, `${filmInfoId.alternativeName || filmInfoId.enName}`, `${translateCategory(filmInfoId.type)}`, 'смотреть', 'онлайн', 'бесплатно', 'hd'],
    openGraph: {
      title: `${filmInfoId.name} ${filmInfoId.year} г. - смотреть онлайн на Filmhub`,
      description: `Смотрите онлайн ${translateCategory(filmInfoId.type)} ${filmInfoId.name} (${filmInfoId.year}) года в хорошем качестве HD, рейтинг кинопоиска: ${roundNumber(filmInfoId.rating.kp, 1)}`,
      images: [
        {
          url: `${filmInfoId.poster.url}`,
        }
      ]
    },
    twitter: {
      title: `${filmInfoId.name} ${filmInfoId.year} г. - смотреть онлайн на Filmhub`,
      description: `Смотрите онлайн ${translateCategory(filmInfoId.type)} ${filmInfoId.name} (${filmInfoId.year}) года в хорошем качестве HD, рейтинг кинопоиска: ${roundNumber(filmInfoId.rating.kp, 1)}`,
      images: [`${filmInfoId.poster.url}`],
    },
  }
}

export default function Film({ params }: { params: { id: number } }) {

  let id = params.id

  return (
   <>
      <FilmPage params={{
        id
      }} />
    </>
  )
}
