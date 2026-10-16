import FilmPage from '@/components/FilmPage/FilmPage';
import type { Metadata, ResolvingMetadata } from 'next'
import { filmsApi } from '@/api/api';
import { getFilmPageData } from '@/server/filmPage';
import translateCategory from '@/components/helpers/translateCategory';
import roundNumber from '@/components/helpers/rounding';
import extractDigits from '@/components/helpers/extractId';
import textTransform from '@/components/helpers/textTransform';
 
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = extractDigits(params.id)
 
  // данные берём из TMDB напрямую на сервере; если фильма там нет — apiget
  const filmInfoId =
    (await getFilmPageData(id)) ?? (await filmsApi.getFilmById(id)).data;
 
 
  return {
    title: `${filmInfoId.name} ${filmInfoId.year} г. - смотреть онлайн на Filmhub`,
    description: `Смотрите онлайн ${translateCategory(filmInfoId.type)} ${filmInfoId.name} (${filmInfoId.year}) года в хорошем качестве HD, рейтинг кинопоиска: ${roundNumber(filmInfoId.rating.kp, 1)}`,
    keywords: [`${filmInfoId.name}`, `${filmInfoId.year}`, `${filmInfoId.alternativeName || filmInfoId.enName}`, `${translateCategory(filmInfoId.type)}`, 'смотреть', 'онлайн', 'бесплатно', 'hd'],
    openGraph: {
      title: `${filmInfoId.name} ${filmInfoId.year} г. - смотреть онлайн на Filmhub`,
      description: `${filmInfoId.description}`,
      images: [
        {
          /* Постер из TMDB: у каждой страницы фильма своё превью, поэтому
             ссылка на конкретный фильм в чате выглядит как карточка фильма,
             а не как общая картинка сайта. Размеры — стандарт TMDB w500:
             Telegram по ним строит превью точнее. */
          url: `${filmInfoId.poster.url}`,
          width: 500,
          height: 750,
          alt: `${filmInfoId.name} — смотреть онлайн`,
        }
      ]
    },
    twitter: {
      title: `${filmInfoId.name} ${filmInfoId.year} г. - смотреть онлайн на Filmhub`,
      description: `Смотрите онлайн ${translateCategory(filmInfoId.type)} ${filmInfoId.name} (${filmInfoId.year}) года в хорошем качестве HD, рейтинг кинопоиска: ${roundNumber(filmInfoId.rating.kp, 1)}`,
      images: [`${filmInfoId.poster.url}`],
    },
    alternates: {
      canonical: `${filmInfoId.name ? `https://filmhub.one/film/${id}-${textTransform(filmInfoId.name)}${filmInfoId.year ? '-'+filmInfoId.year : ''}` : `https://filmhub.one/film/${id}`}`,
    }
  }
}

export default function Film({ params }: { params: { id: string } }) {

  let id = extractDigits(params.id)
  
  return (
   <>
      <FilmPage params={{
        id
      }} />
    </>
  )
}
