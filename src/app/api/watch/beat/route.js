import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { currentProfile } from "@/server/profile";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/** Потолок накопления: точнее двух минут всё равно не узнать */
const MAX_TRACKED = 120;
/** Максимум, который принимаем за один запрос — защита от мусора */
const MAX_PER_BEAT = 300;

/**
 * Накопление времени у плеера. Клиент присылает, сколько секунд реально
 * шло воспроизведение с прошлого раза (раз в минуту и при уходе со страницы).
 * Значение ограничиваем сверху: это оценка, а не позиция в фильме.
 */
export async function POST(request) {
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
  const add = Math.max(0, Math.min(MAX_PER_BEAT, Math.floor(Number(body.seconds) || 0)));
  if (!add) return NextResponse.json({ ok: true, watchedSeconds: null }, { headers: noStore });

  const userId = await currentProfile(true);
  const key = { userId, filmId, season, episode };
  const now = new Date();

  const existing = await prisma.watchPosition.findUnique({
    where: { userId_filmId_season_episode: key },
  });

  const watchedSeconds = Math.min(MAX_TRACKED, (existing?.watchedSeconds || 0) + add);

  const row = await prisma.watchPosition.upsert({
    where: { userId_filmId_season_episode: key },
    create: {
      ...key,
      watchedSeconds,
      opens: 1,
      source: "fallback",
      startedAt: now,
      lastOpenedAt: now,
    },
    update: { watchedSeconds, lastOpenedAt: now },
  });

  return NextResponse.json(
    { ok: true, watchedSeconds: row.watchedSeconds, counted: row.watchedSeconds >= 60 },
    { headers: noStore }
  );
}
