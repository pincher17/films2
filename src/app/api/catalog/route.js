import { NextResponse } from "next/server";
import { SLIDER_IDS, buildList, buildSlider, buildTop } from "@/server/catalog";
import { resolveCompanyId } from "@/server/tmdb";
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

const numberOrUndefined = (value) => {
  // важно: Number(null) === 0, поэтому пустой параметр нельзя пропускать через Number
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
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
      const companyId = await resolveCompanyId(company);

      if (!companyId) {
        return NextResponse.json(empty(page, limit, `Студия не найдена в TMDB: ${company}`));
      }

      const result = await buildList({
        page,
        limit,
        types: searchParams.get("types") || "1,2,3",
        companyId,
        genres: studioGenres,
        excludeGenres: DEFAULT_EXCLUDED_GENRES.filter((genre) => !studioGenres.includes(genre)),
        yearRange: studioYears,
        yearFrom: studioYears[0],
        yearTo: studioYears[1],
        ratingRange: studioRatings,
        ratingFrom: studioRatings[0],
        ratingTo: studioRatings[1],
        sort: searchParams.get("sort") === "1" ? "1" : "-1",
        countryMode: "all",
        excludeAsianByDefault: false,
        requirePoster: true,
        voteCountMin: numberOrUndefined(searchParams.get("voteCountMin")) ?? 50,
      });

      return NextResponse.json({ ...result, company });
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
    const genres = listOf(searchParams.get("genres"));

    const result = await buildList({
      page,
      limit,
      types: searchParams.get("types") || "1,2,3",
      genres,
      excludeGenres: DEFAULT_EXCLUDED_GENRES.filter((genre) => !genres.includes(genre)),
      yearRange: yearFrom !== undefined && yearTo !== undefined ? [yearFrom, yearTo] : undefined,
      yearFrom,
      yearTo,
      ratingRange: ratingFrom !== undefined && ratingTo !== undefined ? [ratingFrom, ratingTo] : undefined,
      ratingFrom,
      ratingTo,
      sort: searchParams.get("sort") === "1" ? "1" : "-1",
      countryMode,
      excludeAsianByDefault: countryMode === "all",
      requirePoster: true,
      voteCountMin: numberOrUndefined(searchParams.get("voteCountMin")) ?? 300,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.warn("[api/catalog] ошибка:", error?.message);
    return NextResponse.json(empty(page, limit, String(error?.message || error)));
  }
}
