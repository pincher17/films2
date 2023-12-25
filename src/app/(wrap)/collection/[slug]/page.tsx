import FilmPage from '@/components/FilmPage/FilmPage';
import type { Metadata, ResolvingMetadata } from 'next'
import { filmsApiV4 } from '@/api/apiV4';
import CollectionPage from '@/components/CollectionPage/CollectionPage';
 
type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug
  // fetch data
  const response = await filmsApiV4.getInfoSlug(slug)

  const slugInfo = response.data;
 
 
  return {
    title: `${slugInfo.name} - смотреть онлайн на Filmhub`,
    description: `Смотрите онлайн ${slugInfo.name} в хорошем качестве HD на онлайн-кинотеатре filmhub`,
    keywords: [`${slugInfo.name}`, `Смотреть онлайн`, `Filmhub`, 'смотреть', 'онлайн', 'бесплатно', 'hd'],
    openGraph: {
      title: `${slugInfo.name} - смотреть онлайн на Filmhub`,
      description: `Смотрите онлайн ${slugInfo.name} в хорошем качестве HD на онлайн-кинотеатре filmhub`,
      images: [
        {
          url: `${slugInfo.cover.url}`,
        }
      ]
    },
    twitter: {
      title: `${slugInfo.name} - смотреть онлайн на Filmhub`,
      description: `Смотрите онлайн ${slugInfo.name} в хорошем качестве HD на онлайн-кинотеатре filmhub`,
      images: [`${slugInfo.cover.url}`],
    },
    alternates: {
      canonical: `https://filmhub.lol/collection/${slugInfo.name}`,
    }
  }
}

export default function Collection({ params }: { params: { slug: string } }) {
    
  let slug = params.slug
  return (
   <>
      <CollectionPage params={{
        slug
      }} />
    </>
  )
}
