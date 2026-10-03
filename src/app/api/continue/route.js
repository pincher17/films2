import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/server/prisma";
import { buildCardsByKinopoiskIds } from "@/server/catalog";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/**
 * «Продолжить просмотр»: начатое, но не досмотренное, свежее сверху.
 * Профиль берём из той же cookie, что и позиции, поэтому ряд работает и без
 * входа — а после входа подхватывает историю аккаунта.
 */
export async function GET() {
  const userId = cookies().get("fh_profile")?.value;
  if (!userId) return NextResponse.json({ docs: [] }, { headers: noStore });

  const rows = await prisma.watchPosition.findMany({
    where: { userId, seconds: { gt: 15 }, completed: false },
    orderBy: { updatedAt: "desc" },
    take: 20,
  });

  if (!rows.length) return NextResponse.json({ docs: [] }, { headers: noStore });

  const errors = [];
  const cards = await buildCardsByKinopoiskIds(rows.map((row) => row.filmId), errors);
  // id карточки — строка, filmId в базе — число: приводим к строке
  const byFilmId = new Map(rows.map((row) => [String(row.filmId), row]));

  const docs = cards.map((card) => {
    const row = byFilmId.get(String(card.id));
    const duration = row?.duration || null;
    const percent =
      duration && row?.seconds ? Math.min(100, Math.round((row.seconds / duration) * 100)) : null;

    return {
      ...card,
      // для фильмов показываем остаток, для сериалов — сезон и серию
      progress: {
        seconds: row?.seconds ?? 0,
        duration,
        percent,
        season: row?.season || 0,
        episode: row?.episode || 0,
      },
    };
  });

  if (!cards.length && errors.length) {
    console.warn("[continue] карточки не собрались:", errors.join("; "));
  }

  return NextResponse.json({ docs }, { headers: noStore });
}
