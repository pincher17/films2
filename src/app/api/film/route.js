import { NextResponse } from "next/server";
import { getFilmPageData } from "@/server/filmPage";

/**
 * Карточка фильма для фронтенда: TMDB + Wikidata, под кинопоисковский id.
 * GET /api/film?id=301  →  данные в формате FilmInfoType (как раньше у apiget)
 * Возвращает { info: null }, если фильма нет в TMDB — тогда фронт идёт в apiget.
 */
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ info: null, error: "не передан id" }, { status: 400 });
  }

  try {
    const info = await getFilmPageData(id);
    return NextResponse.json({ info: info || null, source: info ? "tmdb" : null });
  } catch (error) {
    console.warn("[api/film] ошибка:", error?.message);
    return NextResponse.json({ info: null, error: String(error?.message || error) });
  }
}
