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

  // старше 90 дней в ряд не показываем: иначе он копит брошенное навсегда
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const rows = await prisma.watchPosition.findMany({
    where: {
      userId,
      /*
       * Раньше здесь стояло completed: false — и досмотренная серия исчезала
       * из ряда целиком. Но человек, который закрыл серию за две минуты до
       * конца, ждёт её в «Продолжить просмотр»: ряд пропадал полностью.
       * Теперь показываем и досмотренное — с его реальным прогрессом.
       */
      // либо настоящая позиция из нашего плеера, либо накопленное время
      // у встроенного плеера (fallback): порог — минута
      OR: [{ seconds: { gt: 15 } }, { watchedSeconds: { gte: 60 } }],
      updatedAt: { gte: ninetyDaysAgo },
    },
    orderBy: { updatedAt: "desc" },
    // берём с запасом: после объединения по фильму останется нужное число
    take: 60,
  });

  // Один фильм — одна карточка. У сериала записей много (по одной на серию),
  // и без этого «Доктор Хаус» появлялся бы в ряду несколько раз. Список уже
  // отсортирован по updatedAt DESC, поэтому первая запись фильма — самая свежая.
  // Старые серии в базе не трогаем: они нужны для продолжения конкретной серии.
  const latestByFilm = new Map();
  for (const row of rows) {
    if (!latestByFilm.has(row.filmId)) latestByFilm.set(row.filmId, row);
  }
  const uniqueRows = [...latestByFilm.values()].slice(0, 20);

  if (!rows.length) return NextResponse.json({ docs: [] }, { headers: noStore });

  const errors = [];
  const cards = await buildCardsByKinopoiskIds(uniqueRows.map((row) => row.filmId), errors);
  /* Карточка imdb-фильма имеет id вида tt0121955, а запись в базе — число
     -121955. Кладём в карту оба ключа, иначе прогресс не находится. */
  const byFilmId = new Map();
  uniqueRows.forEach((row) => {
    byFilmId.set(String(row.filmId), row);
    if (row.filmId < 0) {
      byFilmId.set(`tt${String(Math.abs(row.filmId)).padStart(7, "0")}`, row);
    }
  });

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

  if (!uniqueRows.length) return NextResponse.json({ docs: [] }, { headers: noStore });

  if (!cards.length && errors.length) {
    console.warn("[continue] карточки не собрались:", errors.join("; "));
  }

  return NextResponse.json({ docs }, { headers: noStore });
}

/** Убрать запись из ряда «Продолжить просмотр» (крестик на карточке) */
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const filmId = Number(searchParams.get("filmId"));
  if (!Number.isInteger(filmId) || filmId === 0) {
    return NextResponse.json({ ok: false, error: "нужен filmId" }, { status: 400, headers: noStore });
  }

  const userId = await currentProfile(false);
  if (!userId) return NextResponse.json({ ok: false }, { status: 200, headers: noStore });

  /* Если сезон и серия не переданы — убираем фильм целиком, со всеми
     сериями. Иначе удалялась запись «сезон 0, серия 0», которой нет,
     и карточка возвращалась после обновления. */
  const rawSeason = searchParams.get("season");
  const rawEpisode = searchParams.get("episode");
  const scoped =
    rawSeason !== null && rawEpisode !== null && rawSeason !== "" && rawEpisode !== "";

  const where = scoped
    ? {
        userId,
        filmId,
        season: Math.max(0, Math.floor(Number(rawSeason) || 0)),
        episode: Math.max(0, Math.floor(Number(rawEpisode) || 0)),
      }
    : { userId, filmId };

  const removed = await prisma.watchPosition.deleteMany({ where });

  return NextResponse.json({ ok: true, removed: removed.count }, { headers: noStore });
}
