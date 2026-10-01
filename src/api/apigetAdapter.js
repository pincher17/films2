/**
 * Адаптер ответов apiget.ru к структурам, которые уже использует фронтенд
 * (они повторяют формат api.kinopoisk.dev). Дизайн и компоненты не меняются —
 * меняется только источник данных.
 *
 *   apiget:  kinopoisk_id, title_ru, title_en, year, type, duration, rating.kinopoisk.value,
 *            poster_big, poster_small, genre[], country[], similar_materials[] ...
 *   сайт:    id, name, year, rating.kp, poster.url, poster.previewUrl ...
 */

export const CARTOON_GENRES = ["мультфильм", "аниме"];

export function toInt(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function toNumber(value) {
  const parsed = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function kpRating(item) {
  const value = item?.rating?.kinopoisk?.value;
  return value === undefined || value === null ? null : toNumber(value);
}

export function kpVotes(item) {
  return toNumber(item?.rating?.kinopoisk?.count);
}

/**
 * apiget знает только два типа: movie и serial. Мультфильмы/аниме/мультсериалы
 * определяются по жанрам — так они и попадут в translateCategory().
 */
export function mapType(item) {
  const genres = item?.genre || [];
  const isCartoon = genres.includes("мультфильм");
  const isAnime = genres.includes("аниме");

  if (item?.type === "serial") {
    if (isCartoon) return "animated-series";
    if (isAnime) return "anime";
    return "tv-series";
  }

  if (isCartoon) return "cartoon";
  if (isAnime) return "anime";
  return "movie";
}

function toPoster(item) {
  const url = item?.poster_big || item?.poster_small || null;
  const previewUrl = item?.poster_small || item?.poster_big || null;
  return { url, previewUrl };
}

function trailerEmbed(item) {
  const trailer = (item?.trailers || [])[0];
  if (trailer) return trailer.embed || trailer.url || null;

  const share = item?.trailer;
  if (!share) return null;

  const match = /\/share\/(\d+)/.exec(share);
  if (match) {
    return `https://widgets.kinopoisk.ru/discovery/trailer/${match[1]}?onlyPlayer=1&autoplay=0&cover=1`;
  }

  return share;
}

function mapPerson(person, profession) {
  return {
    id: person?.id ?? null,
    name: person?.name || "",
    enName: "",
    description: null,
    enProfession: profession,
    profession,
    photo: null,
  };
}

function mapPersonGroups(item) {
  const groups = [
    ["actors", "actor"],
    ["director", "director"],
    ["scenario", "writer"],
    ["producer", "producer"],
    ["operator", "operator"],
    ["composer", "composer"],
    ["painter", "designer"],
    ["installation", "editor"],
  ];

  return groups.reduce((persons, [field, profession]) => {
    (item?.[field] || []).forEach((person) => {
      persons.push(mapPerson(person, profession));
    });
    return persons;
  }, []);
}

/** Карточка фильма (FilmsType) */
export function toCard(item) {
  const name = item?.title_ru || item?.title_en || "";

  return {
    id: item?.kinopoisk_id ?? null,
    name,
    alternativeName: name,
    enName: item?.title_en || null,
    year: item?.year ?? null,
    type: mapType(item),
    description: item?.description || "",
    shortDescription: item?.tagline || null,
    movieLength: toInt(item?.duration),
    ageRating: toInt(item?.min_age),
    rating: {
      kp: kpRating(item) ?? 0,
      imdb: toNumber(item?.rating?.imdb?.value),
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    votes: {
      kp: kpVotes(item),
      imdb: toNumber(item?.rating?.imdb?.count),
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    poster: toPoster(item),
    logo: { url: null },
    externalId: { imdb: null },
    names: [],
  };
}

/** Похожий фильм / сиквел (в apiget они в одном списке similar_materials) */
export function toSimilarCard(item) {
  const posterSmall = item?.poster_small || null;

  return {
    id: item?.kinopoisk_id ?? null,
    name: item?.title_ru || item?.title_en || "",
    alternativeName: item?.title_ru || item?.title_en || "",
    enName: item?.title_en || null,
    year: item?.year ?? null,
    type: item?.type === "serial" ? "tv-series" : "movie",
    description: "",
    shortDescription: null,
    movieLength: null,
    rating: {
      kp: toNumber(item?.rating_kp),
      imdb: 0,
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    votes: { kp: 0, imdb: 0, filmCritics: 0, russianFilmCritics: 0, await: 0 },
    poster: { url: posterSmall, previewUrl: posterSmall },
    logo: { url: null },
    externalId: { imdb: null },
    names: [],
  };
}

/** Полная карточка фильма (FilmInfoType) для страницы фильма */
export function toFilmInfo(item) {
  const card = toCard(item);
  const trailer = trailerEmbed(item);
  const budget = item?.budget || {};

  return {
    ...card,
    slogan: item?.tagline || null,
    shortDescription: item?.tagline || null,
    backdrop: { url: item?.preview || null },
    facts: (item?.facts || []).map((value) => ({
      value,
      type: "FACT",
      spoiler: false,
    })),
    bloopers: (item?.fail || []).map((value) => ({
      value,
      type: "BLOOPER",
      spoiler: false,
    })),
    genres: (item?.genre || []).map((name) => ({ name })),
    countries: (item?.country || []).map((name) => ({ name })),
    persons: mapPersonGroups(item),
    videos: trailer
      ? { trailers: [{ url: trailer, name: "", site: "kinopoisk" }], teasers: [] }
      : { trailers: [], teasers: [] },
    // apiget отдаёт похожие и сиквелы/приквелы одним списком similar_materials
    similarMovies: (item?.similar_materials || []).map(toSimilarCard),
    sequelsAndPrequels: [],
    stills: (item?.stills || []).map((still) => still?.avatarsUrl).filter(Boolean),
    budget: {
      value: budget.amount ?? null,
      currency: budget.currency || "",
    },
    fees: {
      world: { value: budget.box_world ?? null, currency: budget.currency || "" },
      russia: { value: budget.box_rus ?? null, currency: budget.currency || "" },
      usa: { value: budget.box_usa ?? null, currency: budget.currency || "" },
    },
    premiere: { world: null, country: null },
    productionCompanies: [],
    images: {
      postersCount: 1,
      backdropsCount: item?.preview ? 1 : 0,
      framesCount: (item?.stills || []).length,
    },
    seasonsInfo: [],
    lists: [],
    typeNumber: null,
    ratingMpaa: "",
    status: "",
    technology: { hasImax: false, has3D: false },
    ticketsOnSale: false,
  };
}

/**
 * Ответ в формате api.kinopoisk.dev: { data: { docs, total, page, pages, limit } }
 */
export function toDocsResponse(items, meta = {}) {
  const docs = (items || []).map(toCard).filter((card) => card.id);

  return {
    data: {
      docs,
      total: meta.total ?? docs.length,
      page: meta.page ?? 1,
      pages: meta.pages ?? 1,
      limit: meta.limit ?? docs.length,
    },
  };
}

/** Пустой ответ — чтобы redux-слайсы не зависали на скелетонах при ошибке API */
export function emptyDocsResponse(page = 1, limit = 0) {
  return { data: { docs: [], total: 0, page, pages: page, limit } };
}

/**
 * Ответ поиска. apiget не отдаёт общее количество найденного — только has_next,
 * поэтому total считается как «загружено + возможно ещё одна страница».
 */
export function toSearchResponse(response, { page = 1, limit = 10 } = {}) {
  const docs = (response?.results || []).map(toCard).filter((card) => card.id);
  const hasNext = Boolean(response?.has_next);
  const loaded = (page - 1) * limit + docs.length;

  return {
    data: {
      docs,
      total: hasNext ? loaded + limit : loaded,
      page,
      pages: hasNext ? page + 1 : page,
      limit,
    },
  };
}

export function emptyFilmInfo(id) {
  return {
    id,
    name: "",
    alternativeName: "",
    enName: null,
    year: null,
    type: "movie",
    description: "",
    shortDescription: null,
    slogan: null,
    movieLength: null,
    rating: { kp: 0, imdb: 0, filmCritics: 0, russianFilmCritics: 0, await: 0 },
    votes: { kp: 0, imdb: 0, filmCritics: 0, russianFilmCritics: 0, await: 0 },
    poster: { url: null, previewUrl: null },
    backdrop: { url: null },
    genres: [],
    countries: [],
    facts: [],
    persons: [],
    videos: { trailers: [], teasers: [] },
    similarMovies: [],
    sequelsAndPrequels: [],
    budget: { value: null, currency: "" },
    images: { postersCount: 0, backdropsCount: 0, framesCount: 0 },
  };
}
