import { NextResponse } from "next/server";
import { searchFilms } from "@/server/search";

/**
 * Поиск по названию: TMDB + Wikidata, результат в формате карточек Filmhub.
 * GET /api/search?query=Матрица&page=1
 */
export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  try {
    return NextResponse.json(await searchFilms(query, page));
  } catch (error) {
    console.warn("[api/search] ошибка:", error?.message);
    return NextResponse.json({ docs: [], total: 0, page, pages: page, limit: 10 });
  }
}
