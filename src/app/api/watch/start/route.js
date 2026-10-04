import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { currentProfile } from "@/server/profile";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/**
 * Сигнал «пользователь запустил просмотр»: нажал «Смотреть» или кликнул
 * внутрь плеера. Позицию мы не знаем, поэтому фиксируем сам факт и количество
 * запусков. Запись в ряд «Продолжить просмотр» происходит по порогу времени
 * (см. /api/watch/beat), а не здесь.
 */
export async function POST(request) {
 try {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "ожидается JSON" }, { status: 400, headers: noStore });
  }

  const filmId = Number(body.filmId);
  if (!Number.isInteger(filmId) || filmId <= 0) {
    return NextResponse.json({ ok: false, error: "нужен filmId" }, { status: 400, headers: noStore });
  }
  const season = Math.max(0, Math.floor(Number(body.season) || 0));
  const episode = Math.max(0, Math.floor(Number(body.episode) || 0));

  const userId = await currentProfile(true);
  const key = { userId, filmId, season, episode };
  const now = new Date();

  const existing = await prisma.watchPosition.findUnique({
    where: { userId_filmId_season_episode: key },
  });

  const row = await prisma.watchPosition.upsert({
    where: { userId_filmId_season_episode: key },
    create: {
      ...key,
      opens: 1,
      source: "fallback",
      startedAt: now,
      lastOpenedAt: now,
    },
    update: {
      opens: (existing?.opens || 0) + 1,
      lastOpenedAt: now,
      // источник не понижаем: если позиция приходила из нашего плеера, так и остаётся
      source: existing?.source === "player" ? "player" : "fallback",
    },
  });

  return NextResponse.json(
    { ok: true, opens: row.opens, watchedSeconds: row.watchedSeconds },
    { headers: noStore }
  );
 } catch (error) {
   console.error("[watch/start]", error);
   return NextResponse.json({ ok: false, error: String(error?.message || error) }, { status: 500, headers: noStore });
 }
}