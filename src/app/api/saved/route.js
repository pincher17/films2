import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { currentProfile } from "@/server/profile";
import { buildCardsByKinopoiskIds } from "@/server/catalog";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/** Разбирает filmId из тела запроса или из адреса. */
function parseFilmId(value) {
  const id = Number(String(value ?? "").replace(/\D/g, ""));
  return Number.isFinite(id) && id > 0 ? id : null;
}

/**
 * «Сохранённое на потом».
 *
 * Привязано к профилю — той же cookie, что и история просмотра. Поэтому
 * сохранять можно без входа: у анонимного гостя свой список, а после входа
 * через Telegram он автоматически оказывается в аккаунте (профиль связывается).
 */
export async function GET() {
  const userId = await currentProfile(false);
  if (!userId) return NextResponse.json({ docs: [] }, { headers: noStore });

  const rows = await prisma.savedItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    // с запасом: список сохранённого небольшой, но ограничение нужно
    take: 300,
  });

  if (!rows.length) return NextResponse.json({ docs: [] }, { headers: noStore });

  const errors = [];
  const cards = await buildCardsByKinopoiskIds(rows.map((row) => row.filmId), errors);
  const byFilmId = new Map(rows.map((row) => [String(row.filmId), row]));

  const docs = cards.map((card) => ({
    ...card,
    // дата сохранения нужна для сортировки «по дате добавления»
    savedAt: byFilmId.get(String(card.id))?.createdAt ?? null,
  }));

  return NextResponse.json({ docs }, { headers: noStore });
}

export async function POST(request) {
  // профиль создаём при необходимости: сохранить можно до входа
  const userId = await currentProfile(true);
  if (!userId) return NextResponse.json({ error: "нет профиля" }, { status: 400 });

  let body = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const filmId = parseFilmId(body?.filmId);
  if (!filmId) return NextResponse.json({ error: "нужен filmId" }, { status: 400 });

  // повторное нажатие не должно создавать дубликат
  await prisma.savedItem.upsert({
    where: { userId_filmId: { userId, filmId } },
    update: {},
    create: { userId, filmId },
  });

  return NextResponse.json({ ok: true, filmId }, { headers: noStore });
}

export async function DELETE(request) {
  const userId = await currentProfile(false);
  if (!userId) return NextResponse.json({ ok: true }, { headers: noStore });

  const filmId = parseFilmId(new URL(request.url).searchParams.get("filmId"));
  if (!filmId) return NextResponse.json({ error: "нужен filmId" }, { status: 400 });

  await prisma.savedItem.deleteMany({ where: { userId, filmId } });

  return NextResponse.json({ ok: true, filmId }, { headers: noStore });
}
