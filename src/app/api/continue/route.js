import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/server/prisma";
import { buildCardsByKinopoiskIds } from "@/server/catalog";
import { currentProfile } from "@/server/profile";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/**
 * «Продолжить просмотр»: начатое, но не досмотренное, свежее сверху.
 * Профиль берём из той же cookie, что и позиции, поэтому ряд работает и без
 * входа — а после входа подхватывает историю аккаунта.
 */
export async function GET() {
  const userId = await currentProfile(false);
  if (!userId) return NextResponse.json({ docs: [] }, { headers: noStore });

  const rows = await prisma.watchPosition.findMany({
    where: {
      userId,
      completed: false,
      // либо настоящая позиция из нашего плеера, либо накопленное время
      // у встроенного плеера (fallback): порог — минута
      OR: [{ seconds: { gt: 15 } }, { watchedSeconds: { gte: 60 } }],
    },
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
        source: row?.source || "fallback",
        watchedSeconds: row?.watchedSeconds || 0,
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

/** Убрать запись из ряда «Продолжить просмотр» (крестик на карточке) */
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const filmId = Number(searchParams.get("filmId"));
  if (!Number.isInteger(filmId) || filmId <= 0) {
    return NextResponse.json({ ok: false, error: "нужен filmId" }, { status: 400, headers: noStore });
  }

  const userId = await currentProfile(false);
  if (!userId) return NextResponse.json({ ok: false }, { status: 200, headers: noStore });

  const season = Math.max(0, Math.floor(Number(searchParams.get("season")) || 0));
  const episode = Math.max(0, Math.floor(Number(searchParams.get("episode")) || 0));

  await prisma.watchPosition.deleteMany({ where: { userId, filmId, season, episode } });

  return NextResponse.json({ ok: true }, { headers: noStore });
}
