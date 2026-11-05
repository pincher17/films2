/**
 * Разметка schema.org для страницы фильма: Movie или TVSeries.
 *
 * Зачем: с ней Google показывает в выдаче карточку с рейтингом, годом и
 * режиссёром вместо голубой ссылки. Правила Google: рейтинг в разметке должен
 * быть виден на странице — у нас это те самые плашки IMDb и TMDB.
 *
 * Берём IMDb, если оценка есть, иначе TMDB: подписывать чужой рейтинг своим
 * именем нельзя, поэтому ratingValue всегда идёт от конкретного источника.
 */

type Rating = { value?: number | null; votes?: number | null };

type FilmLike = {
  name?: string;
  alternativeName?: string | null;
  type?: string | null;
  year?: number | null;
  description?: string | null;
  movieLength?: number | null;
  poster?: { url?: string | null } | null;
  genres?: Array<{ name?: string }> | null;
  persons?: Array<{ name?: string; profession?: string | null; enProfession?: string | null }> | null;
  seasons?: Array<{ number?: number }> | null;
  ratings?: { imdb?: Rating | null; tmdb?: Rating | null } | null;
  externalId?: { imdb?: string | null } | null;
};

const SITE = "https://filmhub.one";

/** Относительные адреса постеров (/img/...) превращаем в абсолютные */
const absolute = (url?: string | null) =>
  url ? (url.startsWith("http") ? url : `${SITE}${url}`) : undefined;

export default function filmJsonLd(film: FilmLike | null | undefined, canonicalUrl: string) {
  if (!film?.name) return null;

  const isSeries = String(film.type || "").includes("series");
  const imdb = film.ratings?.imdb;
  const tmdb = film.ratings?.tmdb;
  const rating = imdb?.value ? imdb : tmdb;

  const persons = film.persons || [];
  const actors = persons
    .filter((person) => /актер|actor/i.test(`${person.profession} ${person.enProfession}`))
    .slice(0, 10)
    .map((person) => ({ "@type": "Person", name: person.name }))
    .filter((person) => person.name);

  const directors = persons
    .filter((person) => /режисс|director/i.test(`${person.profession} ${person.enProfession}`))
    .slice(0, 3)
    .map((person) => ({ "@type": "Person", name: person.name }))
    .filter((person) => person.name);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": isSeries ? "TVSeries" : "Movie",
    name: film.name,
    url: canonicalUrl,
    ...(film.alternativeName ? { alternateName: film.alternativeName } : {}),
    ...(film.description ? { description: film.description.slice(0, 400) } : {}),
    ...(absolute(film.poster?.url) ? { image: absolute(film.poster?.url) } : {}),
    ...(film.year ? { datePublished: String(film.year) } : {}),
    ...(film.genres?.length
      ? { genre: film.genres.map((genre) => genre.name).filter(Boolean) }
      : {}),
    ...(actors.length ? { actor: actors } : {}),
    ...(directors.length && !isSeries ? { director: directors } : {}),
    ...(directors.length && isSeries ? { creator: directors } : {}),
    ...(!isSeries && film.movieLength ? { duration: `PT${film.movieLength}M` } : {}),
    ...(isSeries && film.seasons?.length ? { numberOfSeasons: film.seasons.length } : {}),
    ...(film.externalId?.imdb ? { sameAs: `https://www.imdb.com/title/${film.externalId.imdb}/` } : {}),
    ...(rating?.value
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.value,
            bestRating: 10,
            worstRating: 1,
            /* ratingCount обязателен: без него Google отбрасывает разметку */
            ratingCount: rating.votes && rating.votes > 0 ? rating.votes : 1,
          },
        }
      : {}),
  };

  return data;
}
