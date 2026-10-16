import { NextResponse } from "next/server";
import { searchFilms } from "@/server/search";

/**
 * Поиск по названию: TMDB + Wikidata, результат в формате карточек Filmhub.
 * GET /api/search?query=Матрица&page=1
 */
export const dynamic = "force-dynamic";

/* Результаты поиска не кэшируем: иначе браузер показывает старую выдачу,
   и кажется, что фильм не находится. */
const noStore = { "Cache-Control": "no-store" };

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1;

  try {
    return NextResponse.json(await searchFilms(query, page), { headers: noStore });
  } catch (error) {
    console.warn("[api/search] ошибка:", error?.message);
    return NextResponse.json({ docs: [], total: 0, page, pages: page, limit: 10 }, { headers: noStore });
  }
}
