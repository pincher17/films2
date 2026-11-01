/**
 * Сборка списков фильмов для сайта: TMDB (фильтры + сортировка + точная
 * пагинация) -> Wikidata (kinopoisk_id) -> apiget list (данные карточки, один
 * раз на фильм) -> карточки в формате, который ждёт фронтенд.
 *
 * Тяжёлые клиентские фильтры из прошлой версии больше не нужны: диапазон лет,
 * рейтинг, сортировка, жанры и пагинация считаются на стороне TMDB. Локально
 * остаются только проверки, которых у TMDB нет: исключения стран, отсев
 * «короткометражек» по хронометражу и точная сверка года/рейтинга по данным КП.
 */

import { discover, posterUrl, resolveGenre, resolveKeywordId, tmdbGet, KEYWORD_ALIASES } from "./tmdb.js";
import { prisma } from "./prisma.js";
import { resolveRecords } from "./kpMap.js";

/**
 * Страниц TMDB на одну страницу сайта (страницы TMDB по 20 элементов).
 * Больше страниц = шире пул кандидатов: часть фильмов отсеивается локальными
 * фильтрами (исключения стран), поэтому 4 страницы дают полноценную выдачу.
 */
const TMDB_PAGES_PER_SITE_PAGE = 2;

/** Прогрев кэша: какие слайдеры главной страницы собрать заранее */
export const SLIDER_IDS = ["films", "series", "thriller", "comedy", "drama", "boevik", "detective", "fantasy", "new"];

const COUNTRIES_EXCLUDED_BY_DEFAULT = ["RU", "UA", "BY", "KZ", "KR", "CN", "TH", "IN", "JP", "TW", "TR"];
const ASIAN_LANGUAGES = ["ko", "zh", "th", "hi", "ja", "tr"];
const ASIAN_COUNTRIES = ["KR", "CN", "TH", "IN", "JP", "TW", "TR"];
const RU_COUNTRIES = ["RU", "BY", "KZ", "UA", "SU"];

const CARTOON_MARKERS = ["мультфильм", "анимац", "animation"];

function isCartoon(record) {
  const kpGenres = record.kpGenres || [];
  if (kpGenres.some((genre) => CARTOON_MARKERS.some((marker) => String(genre).toLowerCase().includes(marker)))) {
    return true;
  }
  return (record.genres || []).some((genre) =>
    CARTOON_MARKERS.some((marker) => String(genre).toLowerCase().includes(marker))
  );
}

function cardType(record) {
  const cartoon = isCartoon(record);
  if (record.media === "tv") return cartoon ? "animated-series" : "tv-series";
  return cartoon ? "cartoon" : "movie";
}

/**
 * Карточки по кинопоисковым номерам: нужно для «Продолжить просмотр», где в
 * базе лежат именно эти номера. Порядок входа сохраняем.
 */
export async function buildCardsByKinopoiskIds(ids, errors) {
  const { resolveTmdbByKinopoisk } = await import("./filmPage");
  const { tmdbGet } = await import("./tmdb");
  const cards = [];

  for (const rawId of ids) {
    const kinopoiskId = Number(rawId);
    if (!kinopoiskId) continue;
    try {
      // resolveTmdbByKinopoisk отдаёт только { tmdbId, media } — сам фильм
      // нужно запросить отдельно
      const link = await resolveTmdbByKinopoisk(kinopoiskId);
      if (!link?.tmdbId) {
        errors?.push(`${kinopoiskId}: нет соответствия в TMDB`);
        continue;
      }
      const media = link.media === "tv" ? "tv" : "movie";
      const item = await tmdbGet(`/${media}/${link.tmdbId}`);
      if (!item?.id) {
        errors?.push(`${kinopoiskId}: TMDB не отдал данные (${media}/${link.tmdbId})`);
        continue;
      }
      const records = await resolveRecords(media, [item]);
      const record = records.get(item.id) || [...records.values()][0];
      if (record) {
        // id карточки — всегда кинопоисковый: по нему строятся ссылки и плеер.
        // У фильмов из ручного списка соответствий record.id пустой, поэтому
        // подставляем id, с которым пришли в функцию.
        cards.push({ ...toCard(record), id: kinopoiskId });
      }
    } catch (error) {
      console.warn("[cards] не удалось собрать карточку", kinopoiskId, error?.message);
      errors?.push(`${kinopoiskId}: ${error?.message}`);
    }
  }
  return cards;
}

export function toCard(record) {
  const year = record.tmdbYear ?? record.kpYear ?? null;
  const name = record.kpTitle || record.tmdbTitle || "";
  const tmdbPoster = posterUrl(record.tmdbPoster);
  const big = record.kpPosterBig || tmdbPoster;
  const small = record.kpPosterSmall || tmdbPoster;

  /* Рейтинг: IMDb точнее (больше голосов), TMDB — запасной вариант */
  const rating = record.imdbRating ?? record.tmdbRating ?? record.kpRating ?? null;
  const votes = record.imdbVotes ?? record.tmdbVotes ?? record.kpVotes ?? null;

  return {
    /* Если кинопоискового id нет — ведём по imdb (плеер его принимает) */
    id: record.kinopoiskId || record.imdbId || null,
    name,
    alternativeName: name,
    enName: null,
    year,
    type: cardType(record),
    description: "",
    shortDescription: null,
    movieLength: null,
    rating: {
      /* Пока показываем TMDB, как и раньше. IMDb копится в базе и включим
         его, когда соответствий станет достаточно. */
      kp: record.tmdbRating ?? record.kpRating ?? 0,
      imdb: record.imdbRating ?? 0,
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    votes: {
      kp: votes ?? 0,
      imdb: record.imdbVotes ?? 0,
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    poster: { url: big, previewUrl: small },
    logo: { url: null },
    externalId: { imdb: null },
    names: [],
  };
}

function inRange(value, range) {
  return typeof value === "number" && value >= range[0] && value <= range[1];
}

/**
 * Год везде берём из TMDB: он есть всегда, а кинопоисковский появляется только
 * при пополненном балансе apiget. Иначе поведение фильтров зависело бы от
 * состояния чужого кошелька, а год в фильтре мог не совпадать с годом на карточке.
 */

/** Фильтры TMDB по типу материала */
function mediaList(types, genres) {
  /* «мультсериал» — наша метка, а не жанр TMDB: оставляем только сериалы */
  if ((genres || []).some((genre) => String(genre).toLowerCase() === "мультсериал")) {
    return ["tv"];
  }
  const selected = String(types || "1,2,3").split(",");
  const has = (value) => selected.includes(value);
  const movies = has("1");
  const series = has("2");
  const cartoons = has("3");

  if (!movies && !series && !cartoons) return [];
  // мультфильмы — это фильмы, мультсериалы — сериалы, поэтому:
  if (movies && !series) return ["movie"]; // «Фильмы», «Фильмы+Мультфильмы»
  if (!movies && series) return ["tv"]; // «Сериалы», «Сериалы+Мультфильмы»
  return ["movie", "tv"]; // выбрано и то, и другое
}

async function buildServerParams(media, options) {
  const params = {};
  const isTv = media === "tv";

  if (options.yearFrom) params[isTv ? "first_air_date.gte" : "primary_release_date.gte"] = `${options.yearFrom}-01-01`;
  if (options.yearTo) params[isTv ? "first_air_date.lte" : "primary_release_date.lte"] = `${options.yearTo}-12-31`;

  // окно рейтинга шире выбранного: точную сверку делаем по рейтингу Кинопоиска
  if (options.ratingFrom !== undefined) params["vote_average.gte"] = Math.max(0, Number(options.ratingFrom) - 1.5);
  if (options.ratingTo !== undefined) params["vote_average.lte"] = Math.min(10, Number(options.ratingTo) + 1.5);

  /**
   * Порог по числу голосов. Замерено: при сортировке по дате и пороге >=300
   * Wikidata знает kinopoisk_id у 85% фильмов, при >=20 — только у 25%
   * (свежие релизы слишком нишевые). Для сортировки по популярности хватает 20.
   */
  params["vote_count.gte"] = options.voteCountMin ?? 300;
  if (!isTv) params["with_runtime.gte"] = 40; // вместо исключения «короткометражка»
  else params["without_genres"] = [10764, 10767, 10763, 10766].join(",");

  // подборки сортируются по рейтингу/популярности, каталог — по дате выхода
  if (options.sortBy) {
    params.sort_by = options.sortBy;
  } else if (options.sort === "1") {
    params.sort_by = isTv ? "first_air_date.asc" : "primary_release_date.asc";
  } else {
    params.sort_by = isTv ? "first_air_date.desc" : "primary_release_date.desc";
  }

  if (options.countryMode === "ru") params.with_original_language = "ru";

  // страницы студий: у сериалов берём сеть (что вышло на платформе),
  // у фильмов — продюсерскую компанию
  /* Страницы студий: фильтруем по платформе, где контент доступен.
     По продюсерской компании выходило 4 фильма у Netflix — он их просто
     покупает, а не снимает. */
  if (options.watchProvider) {
    params.with_watch_providers = options.watchProvider;
    params.watch_region = options.watchRegion || "US";
  } else if (isTv && options.networkId) {
    params.with_networks = options.networkId;
  } else if (options.companyId) {
    params.with_companies = options.companyId;
  }

  if (options.cartoonsOnly) {
    const animation = await resolveGenre("мультфильм", media);
    if (animation) params.with_genres = String(animation.id);
  }

  for (const word of options.keywords || []) {
    const keywordId = await resolveKeywordId(word);
    if (keywordId) params.with_keywords = [params.with_keywords, keywordId].filter(Boolean).join(",");
  }

  const genreIds = [];
  for (const name of options.genres || []) {
    const genre = await resolveGenre(name, media);
    if (genre) {
      genreIds.push(genre.id);
      continue;
    }
    /* Ключевые слова используем только для жанров, которых нет в TMDB вообще
       (биография, мюзикл, спорт…). Для остальных первый результат поиска
       оказывался случайным («экшен-триллер» вместо «триллера») и обнулял выдачу. */
    if (KEYWORD_ALIASES[String(name).toLowerCase()] !== undefined) {
      const keywordId = await resolveKeywordId(name);
      if (keywordId) params.with_keywords = [params.with_keywords, keywordId].filter(Boolean).join(",");
    }
  }
  if (genreIds.length) {
    /*
     * Жанры объединяем через «|» (ИЛИ), а не через «,» (И). С запятой TMDB
     * искал фильмы, у которых ОДНОВРЕМЕННО все выбранные жанры — например
     * «триллер И комедия И драма», и выдача почти всегда оказывалась пустой.
     */
    params.with_genres = [params.with_genres, ...genreIds].filter(Boolean).join("|");
  }

  const withoutGenres = [];
  for (const name of options.excludeGenres || []) {
    const genre = await resolveGenre(name, media);
    if (genre) withoutGenres.push(genre.id);
  }
  if (withoutGenres.length) {
    /* Жанр не может быть одновременно обязательным и запрещённым: из-за этого
       «драма» в сериалах давала ноль результатов. Убираем пересечения. */
    const required = String(params.with_genres || "").split("|").filter(Boolean);
    const safeWithout = withoutGenres.filter((id) => !required.includes(String(id)));
    const merged = [params.without_genres, ...safeWithout].filter(Boolean);
    // и дубликаты тоже убираем
    params.without_genres = [...new Set(merged.join(",").split(",").filter(Boolean))].join(",");
  }

  return params;
}

/**
 * Дешёвый отсев по данным TMDB — до того, как мы потратим запросы на
 * сопоставление и карточку Кинопоиска.
 */
function buildPreFilter(options) {
  return (base) => {
    if (options.yearRange && base.tmdbYear) {
      const [from, to] = options.yearRange;
      if (base.tmdbYear < from - 1 || base.tmdbYear > to + 1) return false;
    }

    const countries = base.originCountry || [];
    const language = base.originalLanguage;

    if (options.countryMode === "ru") {
      return language === "ru" || countries.some((code) => RU_COUNTRIES.includes(code));
    }
    if (options.countryMode === "foreign" || options.excludeAsianByDefault) {
      if (countries.some((code) => ASIAN_COUNTRIES.includes(code))) return false;
      if (ASIAN_LANGUAGES.includes(language)) return false;
    }

    return true;
  };
}

function passesLocalFilters(record, options) {
  /* Достаточно любого id: кинопоискового или imdb */
  if (!record?.kinopoiskId && !record?.imdbId) return false;

  const year = record.tmdbYear ?? record.kpYear;
  if (options.yearRange && !inRange(year, options.yearRange)) return false;

  const rating = record.tmdbRating ?? record.kpRating;
  if (options.ratingRange && !inRange(rating, options.ratingRange)) return false;

  const countries = record.originCountry || [];
  const language = record.originalLanguage;

  if (options.countryMode === "ru") {
    if (!(language === "ru" || countries.some((code) => RU_COUNTRIES.includes(code)))) return false;
  } else if (options.countryMode === "foreign") {
    if (countries.some((code) => COUNTRIES_EXCLUDED_BY_DEFAULT.includes(code))) return false;
    if (ASIAN_LANGUAGES.includes(language)) return false;
  } else if (options.excludeAsianByDefault) {
    if (countries.some((code) => ASIAN_COUNTRIES.includes(code))) return false;
    if (ASIAN_LANGUAGES.includes(language)) return false;
  }

  if (options.requirePoster && !record.kpPosterSmall && !record.kpPosterBig && !record.tmdbPoster) return false;

  return true;
}

/** Перемешивание (Фишер–Йетс): нужно для подборок-«находок», а не топов */
function shuffleArray(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function sortRecords(records, sort) {
  return records.slice().sort((a, b) => {
    const yearA = a.tmdbYear ?? a.kpYear ?? 0;
    const yearB = b.tmdbYear ?? b.kpYear ?? 0;
    if (yearA !== yearB) return sort === "1" ? yearA - yearB : yearB - yearA;
    const ratingA = a.tmdbRating ?? a.kpRating ?? 0;
    const ratingB = b.tmdbRating ?? b.kpRating ?? 0;
    if (ratingA !== ratingB) return ratingB - ratingA;
    return (b.kpVotes ?? b.tmdbVotes ?? 0) - (a.kpVotes ?? a.tmdbVotes ?? 0);
  });
}

/** Основной сборщик: options -> карточки сайта */
export async function buildList(options) {
  const media = mediaList(options.types, options.genres);
  if (!media.length) return { docs: [], total: 0, page: options.page || 1, pages: 1, limit: options.limit };

  const page = options.page || 1;
  const pagesPerSite = options.tmdbPages ?? TMDB_PAGES_PER_SITE_PAGE;
  const firstTmdbPage = (page - 1) * pagesPerSite + 1;

  const requests = [];
  media.forEach((kind) => {
    for (let offset = 0; offset < pagesPerSite; offset += 1) {
      requests.push({ kind, tmdbPage: firstTmdbPage + offset });
    }
  });

  const paramsByMedia = new Map();
  for (const kind of media) {
    paramsByMedia.set(kind, await buildServerParams(kind, options));
  }

  const responses = await Promise.all(
    requests.map(async ({ kind, tmdbPage }) => ({
      kind,
      response: await discover(kind, { ...paramsByMedia.get(kind), page: tmdbPage }),
    }))
  );

  const byMedia = new Map();
  const totalsByMedia = new Map();
  let totalResults = 0;
  let totalPages = 0;

  responses.forEach(({ kind, response }) => {
    const list = byMedia.get(kind) || new Map();
    (response.results || []).forEach((item) => list.set(item.id, item));
    byMedia.set(kind, list);
    /* Фильмы и сериалы запрашиваются отдельно — их счётчики складываем.
       Но внутри одного типа страниц может быть несколько, и TMDB на каждой
       возвращает один и тот же total, поэтому берём максимум, а не сумму. */
    totalResults = Math.max(totalResults, 0);
    const perKind = totalsByMedia.get(kind) || 0;
    totalsByMedia.set(kind, Math.max(perKind, response.totalResults || 0));
    totalPages = Math.max(totalPages, response.totalPages || 0);
  });

  // складываем максимумы по каждому типу: фильмы + сериалы
  totalResults = [...totalsByMedia.values()].reduce((sum, value) => sum + value, 0);

  const preFilter = buildPreFilter(options);

  const records = [];
  // два разных фильма TMDB могут сопоставиться с одним кинопоисковым id —
  // в списке это даёт одинаковые key и React путает карточки, поэтому дубли убираем
  const seenKinopoisk = new Set();
  /* Соответствия imdb: у зарубежного контента кинопоискового id часто нет,
     и без этого карточки просто исчезали из выдачи. */
  const imdbByKey = new Map();
  const imdbRatingsByKey = new Map();
  try {
    const allItems = [...byMedia.entries()].flatMap(([kind, list]) =>
      [...list.values()].map((item) => ({ kind, id: item.id }))
    );
    const rows = await prisma.imdbMap.findMany({
      where: {
        OR: allItems.map(({ kind, id }) => ({ media: kind, tmdbId: id })),
      },
      select: { tmdbId: true, media: true, imdbId: true },
    });
    rows.forEach((row) => imdbByKey.set(`${row.media}:${row.tmdbId}`, row.imdbId));

    /* Рейтинги IMDb для этих же фильмов */
    const imdbIds = [...imdbByKey.values()].filter(Boolean);
    if (imdbIds.length) {
      const ratings = await prisma.imdbRating.findMany({
        where: { imdbId: { in: imdbIds } },
        select: { imdbId: true, rating: true, votes: true },
      });
      const byImdb = new Map(ratings.map((r) => [r.imdbId, r]));
      rows.forEach((row) => {
        const found = byImdb.get(row.imdbId);
        if (found) imdbRatingsByKey.set(`${row.media}:${row.tmdbId}`, found);
      });
    }
  } catch {
    undefined;
  }

  for (const [kind, list] of byMedia.entries()) {
    const items = [...list.values()];
    const resolved = await resolveRecords(kind, items, { preFilter });
    items.forEach((item) => {
      const record = resolved.get(item.id);
      if (record && !record.imdbId) {
        record.imdbId = imdbByKey.get(`${kind}:${item.id}`) || null;
      }
      if (record) {
        const imdbRating = imdbRatingsByKey.get(`${kind}:${item.id}`);
        if (imdbRating) {
          record.imdbRating = imdbRating.rating;
          record.imdbVotes = imdbRating.votes;
        }
      }
      const key = record?.kinopoiskId || record?.imdbId;
      if (!key || seenKinopoisk.has(key)) return;
      seenKinopoisk.add(key);
      records.push(record);
    });
  }

  const passed = records.filter((record) => passesLocalFilters(record, options));
  const filtered = options.shuffle
    ? shuffleArray(passed)
    : options.ratingSort
    ? passed.sort(
        (a, b) =>
          (b.tmdbRating ?? b.kpRating ?? 0) - (a.tmdbRating ?? a.kpRating ?? 0) ||
          (b.kpVotes ?? b.tmdbVotes ?? 0) - (a.kpVotes ?? a.tmdbVotes ?? 0)
      )
    : sortRecords(passed, options.sort);
  const docs = filtered.slice(0, options.limit).map(toCard).filter((card) => card.id);

  const sitePages = totalPages ? Math.max(1, Math.ceil(totalPages / pagesPerSite)) : page;

  return {
    docs,
    total: totalResults,
    page,
    pages: sitePages,
    limit: options.limit,
  };
}

// ------------------------------------------------------------ пресеты сайта

// Годы считаем от текущей даты, а не пишем числами: иначе выдача «застывает»
// на годе, который был актуален в момент написания кода.
//
// Диапазон намеренно широкий, а сортировка — по рейтингу, а не по дате: иначе
// в ряду оказываются только самые свежие фильмы, хотя интересны и старые тоже.
const CURRENT_YEAR = new Date().getFullYear();

const SLIDERS = {
  // sortBy: "random" — не «лучшее по порядку», а случайная выборка с приличным
  // рейтингом: смысл в том, чтобы наткнуться на интересный фильм.
  films: { types: "1", years: [1970, CURRENT_YEAR], ratings: [6.5, 10], sortBy: "random", voteCountMin: 800 },
  series: { types: "2", years: [2000, CURRENT_YEAR], ratings: [6.5, 10], sortBy: "random", voteCountMin: 300 },
  thriller: { types: "1", genres: ["триллер"], years: [1990, CURRENT_YEAR], ratings: [6.5, 10], sortBy: "random", voteCountMin: 500 },
  comedy: { types: "1", genres: ["комедия"], years: [1990, CURRENT_YEAR], ratings: [6.5, 10], sortBy: "random", voteCountMin: 500 },
  drama: { types: "1", genres: ["драма"], years: [1990, CURRENT_YEAR], ratings: [6.5, 10], sortBy: "random", voteCountMin: 500 },
  boevik: { types: "1", genres: ["боевик"], years: [1990, CURRENT_YEAR], ratings: [6.5, 10], sortBy: "random", voteCountMin: 500 },
  detective: { types: "1", genres: ["детектив"], years: [1990, CURRENT_YEAR], ratings: [6.5, 10], sortBy: "random", voteCountMin: 500 },
  fantasy: { types: "1", genres: ["фантастика"], years: [1990, CURRENT_YEAR], ratings: [6.5, 10], sortBy: "random", voteCountMin: 500 },
  // «Новинки» — единственный ряд, где важен именно свежий год
  new: { types: "1", years: [CURRENT_YEAR, CURRENT_YEAR], ratings: [6.5, 10], sortBy: "date" },
};

/**
 * Тренды TMDB: реальный «топ» за сутки или неделю. В отличие от подборки по
 * рейтингу, это то, что люди смотрят сейчас — меняется само.
 * Окна у TMDB только day и week, «за месяц» не существует.
 */
export async function buildTrending(window = "week", limit = 25, types = "1,2", skip = 0) {
  const media = [];
  if (String(types).includes("1")) media.push("movie");
  if (String(types).includes("2")) media.push("tv");
  if (!media.length) return { docs: [], total: 0, page: 1, pages: 1, limit };

  const responses = await Promise.all(
    media.map((kind) => tmdbGet(`/trending/${kind}/${window === "day" ? "day" : "week"}`))
  );

  const records = [];
  const seen = new Set();

  for (const [index, response] of responses.entries()) {
    const kind = media[index];
    const items = response?.results || [];
    const resolved = await resolveRecords(kind, items, {
      preFilter: buildPreFilter({ excludeAsianByDefault: false }),
    });
    items.forEach((item) => {
      const record = resolved.get(item.id);
      if (!record?.kinopoiskId || seen.has(record.kinopoiskId)) return;
      seen.add(record.kinopoiskId);
      records.push(record);
    });
  }

  const kept = records.filter((record) => passesLocalFilters(record, { requirePoster: true }));

  // skip нужен, чтобы два ряда трендов не показывали одно и то же:
  // «за сутки» и «за неделю» у TMDB сильно пересекаются
  const docs = kept.slice(skip, skip + limit).map(toCard).filter((card) => card.id);

  return { docs, total: docs.length, page: 1, pages: 1, limit };
}

/**
 * Готовые подборки TMDB без фильтров по годам: «сейчас в кино» и «скоро».
 * Порядок перемешиваем — главная должна выглядеть как лента находок, а не
 * как список по ранжиру.
 */
export async function buildMovieShelf(kind, limit = 25) {
  const path = kind === "upcoming" ? "/movie/upcoming" : "/movie/now_playing";
  const response = await tmdbGet(path);
  const items = response?.results || [];

  const resolved = await resolveRecords("movie", items, {
    preFilter: buildPreFilter({ excludeAsianByDefault: false }),
  });

  const records = [];
  const seen = new Set();
  items.forEach((item) => {
    const record = resolved.get(item.id);
    if (!record?.kinopoiskId || seen.has(record.kinopoiskId)) return;
    seen.add(record.kinopoiskId);
    records.push(record);
  });

  const docs = shuffleArray(records.filter((record) => passesLocalFilters(record, { requirePoster: true })))
    .slice(0, limit)
    .map(toCard)
    .filter((card) => card.id);

  return { docs, total: docs.length, page: 1, pages: 1, limit };
}

export function buildSlider(slider, limit = 25, voteCountMin) {
  const preset = SLIDERS[slider] || SLIDERS.films;
  const random = preset.sortBy === "random";

  return buildList({
    // Для случайных подборок: берём случайное окно выдачи TMDB и перемешиваем
    // результат. Порог голосов держим умеренным, чтобы пул был широким, а
    // рейтинг отсекаем локально (не ниже 6.5).
    voteCountMin: voteCountMin ?? preset.voteCountMin ?? 300,
    types: preset.types,
    genres: preset.genres || [],
    yearRange: preset.years,
    yearFrom: preset.years[0],
    yearTo: preset.years[1],
    ratingRange: preset.ratings,
    ratingFrom: preset.ratings[0],
    ratingTo: preset.ratings[1],
    sortBy: random ? "popularity.desc" : undefined,
    shuffle: random,
    sort: "-1",
    limit,
    // случайная страница: при каждом заходе окно выдачи другое
    page: random ? 1 + Math.floor(Math.random() * 5) : 1,
    excludeAsianByDefault: true,
    countryMode: "all",
    requirePoster: true,
  });
}

/** «Топ-10»: вместо мусорного apiget top250 — популярное в TMDB */
export async function buildTop(limit = 10) {
  const responses = await Promise.all([
    discover("movie", { sort_by: "popularity.desc", "vote_count.gte": 300, page: 1 }),
    discover("tv", { sort_by: "popularity.desc", "vote_count.gte": 100, page: 1 }),
  ]);

  const records = [];
  for (const [index, response] of responses.entries()) {
    const kind = index === 0 ? "movie" : "tv";
    const items = response.results || [];
    const resolved = await resolveRecords(kind, items, {
      preFilter: buildPreFilter({ excludeAsianByDefault: true }),
    });
    const seen = new Set(records.map((record) => record.kinopoiskId));
    items.forEach((item) => {
      const record = resolved.get(item.id);
      if (!record?.kinopoiskId || seen.has(record.kinopoiskId)) return;
      seen.add(record.kinopoiskId);
      records.push(record);
    });
  }

  const sorted = records
    .filter((record) => passesLocalFilters(record, { excludeAsianByDefault: true, requirePoster: true }))
    .sort((a, b) => (b.tmdbRating ?? 0) - (a.tmdbRating ?? 0) || (b.kpVotes ?? 0) - (a.kpVotes ?? 0));

  const docs = sorted.slice(0, limit).map(toCard).filter((card) => card.id);
  return { docs, total: docs.length, page: 1, pages: 1, limit };
}
