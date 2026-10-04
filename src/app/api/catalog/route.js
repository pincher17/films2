import { NextResponse } from "next/server";
import { SLIDER_IDS, buildList, buildSlider, buildTop } from "@/server/catalog";
import { platformIds, resolveCompanyId } from "@/server/tmdb";
import { COLLECTION_RECIPES } from "@/data/collectionRecipes";
import { cacheStats } from "@/server/kpMap";

/**
 * Единая точка входа для списков фильмов (каталог, слайдеры главной, топ).
 *
 * Списки собирает TMDB, kinopoisk_id подтягивается через Wikidata, данные
 * карточки — из apiget (один раз на фильм, дальше из кэша).
 *
 * GET /api/catalog?task=catalog&page=1&limit=40&yearFrom=1960&yearTo=2024&...
 */

export const dynamic = "force-dynamic";

const DEFAULT_EXCLUDED_GENRES = [
  "документальный",
  "ток-шоу",
  "реальное ТВ",
  "короткометражка",
  "церемония",
  "игра",
  "концерт",
  "для взрослых",
  "новости",
];

/** 'rating' | 'date-asc' | 'date-desc' (старые значения '1'/'-1' тоже принимаем) */
const sortOptions = (value) => ({
  rating: value === "rating",
  dateAsc: value === "date-asc" || value === "1",
});

const numberOrUndefined = (value) => {
  // важно: Number(null) === 0, поэтому пустой параметр нельзя пропускать через Number
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/** отмечен только чекбокс «Мультфильмы» */
const isCartoonsOnly = (types) => {
  const list = String(types || "1,2,3").split(",");
  return list.includes("3") && !list.includes("1") && !list.includes("2");
};

const listOf = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const empty = (page, limit, error) => ({
  docs: [],
  total: 0,
  page,
  pages: page,
  limit,
  error,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const task = searchParams.get("task") || "catalog";
  const limit = numberOrUndefined(searchParams.get("limit")) ?? 40;
  const page = numberOrUndefined(searchParams.get("page")) ?? 1;

  try {
    if (task === "stats") {
      return NextResponse.json({ ...cacheStats(), tmdbKey: Boolean(process.env.TMDB_KEY) });
    }

    if (task === "slider") {
      const slider = searchParams.get("slider") || "films";
      return NextResponse.json(
        await buildSlider(slider, limit, numberOrUndefined(searchParams.get("voteCountMin")) ?? 300)
      );
    }

    if (task === "prewarm") {
      // прогреваем кэш: главная страница делает это один раз, дальше всё из кэша
      const built = await Promise.all(SLIDER_IDS.map((slider) => buildSlider(slider, 25, 300)));
      const results = {};
      SLIDER_IDS.forEach((slider, index) => {
        results[slider] = built[index].docs.length;
      });
      const catalog = await buildList({
        page: 1,
        limit: 40,
        types: "1,2,3",
        genres: [],
        excludeGenres: DEFAULT_EXCLUDED_GENRES,
        yearRange: [1960, 2024],
        yearFrom: 1960,
        yearTo: 2024,
        ratingRange: [1, 10],
        ratingFrom: 1,
        ratingTo: 10,
        sort: "-1",
        countryMode: "all",
        excludeAsianByDefault: true,
        requirePoster: true,
        voteCountMin: 300,
      });
      return NextResponse.json({ sliders: results, catalog: catalog.docs.length, cache: cacheStats() });
    }

    if (task === "studio") {
      // название студии приходит из настроек сайта, иногда в URL-кодировке
      const raw = searchParams.get("company") || "";
      let company = raw;
      try {
        company = decodeURIComponent(raw);
      } catch {
        company = raw;
      }

      const studioYears = [
        numberOrUndefined(searchParams.get("yearFrom")) ?? 1960,
        numberOrUndefined(searchParams.get("yearTo")) ?? new Date().getFullYear() + 1,
      ];
      const studioRatings = [
        numberOrUndefined(searchParams.get("ratingFrom")) ?? 1,
        numberOrUndefined(searchParams.get("ratingTo")) ?? 10,
      ];
      const studioGenres = listOf(searchParams.get("genres"));
      const studioTypes = searchParams.get("types") || "1,2,3";
      const known = platformIds(company);
      const companyId = known ? known.company : await resolveCompanyId(company);
      const networkId = known ? known.network : null;

      if (!companyId && !networkId) {
        return NextResponse.json(empty(page, limit, `Платформа не найдена в TMDB: ${company}`));
      }

      const result = await buildList({
        page,
        limit,
        types: studioTypes,
        cartoonsOnly: isCartoonsOnly(studioTypes),
        companyId,
        networkId,
        genres: studioGenres,
        excludeGenres: DEFAULT_EXCLUDED_GENRES.filter((genre) => !studioGenres.includes(genre)),
        yearRange: studioYears,
        yearFrom: studioYears[0],
        yearTo: studioYears[1],
        ratingRange: studioRatings,
        ratingFrom: studioRatings[0],
        ratingTo: studioRatings[1],
        sort: sortOptions(searchParams.get("sort")).dateAsc ? "1" : "-1",
        sortBy: sortOptions(searchParams.get("sort")).rating ? "vote_average.desc" : undefined,
        ratingSort: sortOptions(searchParams.get("sort")).rating,
        countryMode: searchParams.get("country") || "all",
        excludeAsianByDefault: false,
        requirePoster: true,
        voteCountMin: numberOrUndefined(searchParams.get("voteCountMin")) ?? 50,
      });

      return NextResponse.json({ ...result, company });
    }

    if (task === "trending") {
    const window = searchParams.get("window") === "day" ? "day" : "week";
    const limit = numberOrUndefined(searchParams.get("limit")) ?? 25;
    const types = searchParams.get("types") || "1,2";
    const data = await buildTrending(window, limit, types);
    return NextResponse.json(data);
  }

  if (task === "collection") {
      const slug = searchParams.get("slug") || "";
      const recipe = COLLECTION_RECIPES[slug];

      if (!recipe) {
        return NextResponse.json(empty(page, limit, `Подборка не найдена: ${slug}`));
      }

      const years = [recipe.yearFrom ?? 1900, recipe.yearTo ?? new Date().getFullYear() + 1];
      const result = await buildList({
        page,
        limit,
        types: recipe.types,
        genres: recipe.genres || [],
        keywords: recipe.keywords || [],
        companyId: recipe.companyId,
        networkId: recipe.networkId,
        sortBy: recipe.sortBy || "popularity.desc",
        ratingSort: !recipe.sortBy || recipe.sortBy.includes("vote_average"),
        yearRange: years,
        yearFrom: years[0],
        yearTo: years[1],
        ratingRange: [1, 10],
        ratingFrom: 1,
        ratingTo: 10,
        sort: "-1",
        countryMode: "all",
        excludeAsianByDefault: false,
        requirePoster: true,
        voteCountMin: recipe.voteCountMin ?? 50,
      });

      return NextResponse.json({ ...result, slug, name: recipe.name });
    }

    if (task === "top") {
      return NextResponse.json(await buildTop(limit));
    }

    // task === 'catalog'
    const yearFrom = numberOrUndefined(searchParams.get("yearFrom"));
    const yearTo = numberOrUndefined(searchParams.get("yearTo"));
    const ratingFrom = numberOrUndefined(searchParams.get("ratingFrom"));
    const ratingTo = numberOrUndefined(searchParams.get("ratingTo"));
    const countryMode = searchParams.get("country") || "all";
    const sortParam = searchParams.get("sort") || "date-desc";
    const typesParam = searchParams.get("types") || "1,2,3";
    const cartoonsOnly = isCartoonsOnly(typesParam);
    const genres = listOf(searchParams.get("genres"));

    const result = await buildList({
      page,
      limit,
      types: typesParam,
      cartoonsOnly,
      genres,
      excludeGenres: DEFAULT_EXCLUDED_GENRES.filter((genre) => !genres.includes(genre)),
      yearRange: yearFrom !== undefined && yearTo !== undefined ? [yearFrom, yearTo] : undefined,
      yearFrom,
      yearTo,
      ratingRange: ratingFrom !== undefined && ratingTo !== undefined ? [ratingFrom, ratingTo] : undefined,
      ratingFrom,
      ratingTo,
      sort: sortOptions(sortParam).dateAsc ? "1" : "-1",
      sortBy: sortOptions(sortParam).rating ? "vote_average.desc" : undefined,
      ratingSort: sortOptions(sortParam).rating,
      countryMode,
      excludeAsianByDefault: countryMode === "all",
      requirePoster: true,
      voteCountMin:
        numberOrUndefined(searchParams.get("voteCountMin")) ??
        // при сортировке по рейтингу порог держим высоким, иначе в топ лезут
        // фильмы с одной оценкой; для свежих лет порог ниже — оценок ещё нет
        (sortOptions(sortParam).rating
          ? 300
          : (yearFrom ?? 1960) >= new Date().getFullYear() - 1
          ? 20
          : // у российского кино в TMDB мало оценок: с порогом 300 новые
          // фильмы (2023–2026) отсекались, и список начинался с 2022
          countryMode === "ru"
          ? 20
          : 300),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.warn("[api/catalog] ошибка:", error?.message);
    return NextResponse.json(empty(page, limit, String(error?.message || error)));
  }
}
