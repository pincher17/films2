import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/server/prisma";

export const dynamic = "force-dynamic";

const COOKIE = "fh_profile";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // год
const MAX_SECONDS = 60 * 60 * 24; // сутки — защита от мусора

const noStore = { "Cache-Control": "no-store" };

function parseIds(searchParams, body) {
  const get = (key) =>
    body && body[key] !== undefined ? body[key] : searchParams.get(key);
  const filmId = Number(get("filmId"));
  const season = Number(get("season") ?? 0) || 0;
  const episode = Number(get("episode") ?? 0) || 0;
  if (!Number.isInteger(filmId) || filmId <= 0) return null;
  if (!Number.isInteger(season) || season < 0) return null;
  if (!Number.isInteger(episode) || episode < 0) return null;
  return { filmId, season, episode };
}

/** Профиль из cookie. Пока без входа; позже свяжем с аккаунтом Google. */
async function currentProfile(create) {
  const store = cookies();
  const id = store.get(COOKIE)?.value;

  if (id) {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (existing) return existing.id;
  }
  if (!create) return null;

  const user = await prisma.user.create({ data: {} });
  store.set(COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return user.id;
}

const shape = (row) =>
  row
    ? {
        season: row.season,
        episode: row.episode,
        seconds: row.seconds,
        percent: row.duration ? Math.round((row.seconds / row.duration) * 100) : null,
        duration: row.duration,
        completed: row.completed,
        updatedAt: row.updatedAt,
      }
    : null;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const ids = parseIds(searchParams);
  if (!ids) {
    return NextResponse.json({ error: "нужен filmId" }, { status: 400, headers: noStore });
  }

  const userId = await currentProfile(false);
  if (!userId) return NextResponse.json({ position: null }, { headers: noStore });

  // latest=1 — последняя позиция по этому фильму, какая бы серия ни была:
  // нужно для плашки «вы остановились здесь» на странице фильма
  if (searchParams.get("latest") === "1") {
    const latest = await prisma.watchPosition.findFirst({
      where: { userId, filmId: ids.filmId },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ position: shape(latest) }, { headers: noStore });
  }

  const row = await prisma.watchPosition.findUnique({
    where: { userId_filmId_season_episode: { userId, ...ids } },
  });
  return NextResponse.json({ position: shape(row) }, { headers: noStore });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "ожидается JSON" }, { status: 400, headers: noStore });
  }

  const ids = parseIds(new URL(request.url).searchParams, body);
  if (!ids) {
    return NextResponse.json({ error: "нужен filmId" }, { status: 400, headers: noStore });
  }

  const seconds = Math.max(0, Math.min(MAX_SECONDS, Math.floor(Number(body.seconds) || 0)));
  const durationRaw = Number(body.duration);
  const duration =
    Number.isFinite(durationRaw) && durationRaw > 0
      ? Math.min(MAX_SECONDS, Math.floor(durationRaw))
      : null;
  // «досмотрено», если осталось меньше двух минут
  const completed =
    typeof body.completed === "boolean"
      ? body.completed
      : duration !== null && duration - seconds <= 120;

  // player — позиция пришла от плеера (точная), fallback — оценка по времени
  const source = body.source === "player" ? "player" : "fallback";

  const userId = await currentProfile(true);
  const row = await prisma.watchPosition.upsert({
    where: { userId_filmId_season_episode: { userId, ...ids } },
    create: { userId, ...ids, seconds, duration, completed, source },
    update: { seconds, duration, completed, source },
  });

  return NextResponse.json({ position: shape(row) }, { headers: noStore });
}
