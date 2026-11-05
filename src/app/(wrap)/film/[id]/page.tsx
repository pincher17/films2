import FilmPage from '@/components/FilmPage/FilmPage';
import type { Metadata, ResolvingMetadata } from 'next'
import { filmsApi } from '@/api/api';
import { getFilmPageData } from '@/server/filmPage';
import translateCategory from '@/components/helpers/translateCategory';
import roundNumber from '@/components/helpers/rounding';
import extractDigits from '@/components/helpers/extractId';
import filmJsonLd from '@/components/helpers/filmJsonLd';
import textTransform from '@/components/helpers/textTransform';
 
type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  /* Адрес может быть кинопоисковым (79848-сопрано) или imdb (tt0121955):
     у imdb цифры в начале нет, и вырезание превращало его в 0 */
  const rawId = String(params.id ?? "");
  const id = /^tt\d+/i.test(rawId) ? rawId : extractDigits(rawId);
 
  // данные берём из TMDB напрямую на сервере; если фильма там нет — apiget
  const filmInfoId =
    (await getFilmPageData(id)) ?? (await filmsApi.getFilmById(id)).data;
 
 
  /* Рейтинг в описании подписываем тем источником, откуда он взят: раньше
     оценка TMDB называлась «рейтингом кинопоиска». */
  const ratings = (filmInfoId as any).ratings || {};
  const ratingText = ratings.imdb?.value
    ? `рейтинг IMDb: ${ratings.imdb.value}`
    : ratings.tmdb?.value
    ? `рейтинг TMDB: ${ratings.tmdb.value}`
    : `рейтинг кинопоиска: ${roundNumber(filmInfoId.rating.kp, 1)}`;

  return {
    title: `${filmInfoId.name} ${filmInfoId.year} г. - смотреть онлайн на Filmhub`,
    description: `Смотрите онлайн ${translateCategory(filmInfoId.type)} ${filmInfoId.name} (${filmInfoId.year}) года в хорошем качестве HD, ${ratingText}`,
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
      description: `Смотрите онлайн ${translateCategory(filmInfoId.type)} ${filmInfoId.name} (${filmInfoId.year}) года в хорошем качестве HD, ${ratingText}`,
      images: [`${filmInfoId.poster.url}`],
    },
    alternates: {
      canonical: `${filmInfoId.name ? `https://filmhub.one/film/${id}-${textTransform(filmInfoId.name)}${filmInfoId.year ? '-'+filmInfoId.year : ''}` : `https://filmhub.one/film/${id}`}`,
    }
  }
}

export default async function Film({ params }: { params: { id: string } }) {

  /* imdb-адрес передаём как есть: кинопоисковый — числом */
  const rawId = String(params.id ?? "");
  const id = /^tt\d+/i.test(rawId) ? rawId : extractDigits(rawId);

  /* Разметка schema.org: с ней Google показывает карточку с рейтингом.
     Данные те же, что уходят в метатеги, — запрос берётся из кеша Next. */
  const filmInfo = await getFilmPageData(id);
  const canonical = filmInfo?.name
    ? `https://filmhub.one/film/${id}-${textTransform(filmInfo.name)}${filmInfo.year ? `-${filmInfo.year}` : ''}`
    : `https://filmhub.one/film/${id}`;
  const jsonLd = filmJsonLd(filmInfo, canonical);

  return (
   <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <FilmPage params={{
        id
      }} />
    </>
  )
}
