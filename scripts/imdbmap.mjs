/**
 * Наполнение соответствий TMDB ↔ IMDb.
 *
 * Зачем: каталог показывает только фильмы, у которых есть кинопоисковый id,
 * а у зарубежных сериалов его часто нет. Зато imdb id есть почти у всего, и
 * плеер его принимает (/embed/imdb/tt...).
 *
 * TMDB отдаёт imdb id в /movie/{id}/external_ids и /tv/{id}/external_ids.
 * Скрипт обходит фильмы из очереди и сохраняет найденное.
 *
 * Запуск: node scripts/imdbmap.mjs [сколько обработать]
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function loadEnv() {
  const text = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
  for (const line of text.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) process.env[match[1]] ??= match[2].trim().replace(/^"|"$/g, "");
  }
}
loadEnv();

const TMDB = process.env.TMDB_KEY;
const LIMIT = Number(process.argv[2]) || 2000;

if (!TMDB) {
  console.error("нет TMDB_KEY в .env.local");
  process.exit(1);
}

async function externalIds(media, tmdbId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/${media}/${tmdbId}/external_ids?api_key=${TMDB}`
  );
  if (!response.ok) return null;
  return response.json();
}

async function main() {
  const mapped = new Set(
    (await prisma.imdbMap.findMany({ select: { tmdbId: true, media: true } })).map(
      (row) => `${row.media}:${row.tmdbId}`
    )
  );

  /* Раньше здесь стоял take: LIMIT * 2 — только самые популярные задачи. Когда
     они оказались размечены, скрипт перестал видеть остальные: 7 947 задач
     лежали ниже по популярности и были недостижимы при любом числе прогонов.
     Теперь смотрим всю таблицу, а порядок по популярности оставляем: сперва
     закрываем то, что чаще открывают на сайте. */
  const tasks = await prisma.trailerTask.findMany({
    where: { tmdbId: { not: null } },
    orderBy: { popularity: "desc" },
    select: { tmdbId: true, media: true },
  });

  const unmapped = tasks.filter(
    (task) => !mapped.has(`${task.media || "movie"}:${task.tmdbId}`)
  );
  const queue = unmapped.slice(0, LIMIT);

  if (!queue.length) {
    console.log(`[imdbmap] размечено всё: задач ${tasks.length}, неразмеченных нет`);
    return;
  }

  console.log(`[imdbmap] обработка: ${queue.length} из ${unmapped.length} неразмеченных`);

  let done = 0;
  let found = 0;

  for (const task of queue) {
    const media = task.media || "movie";
    const data = await externalIds(media, task.tmdbId);
    done += 1;

    if (!data?.imdb_id) continue;

    await prisma.imdbMap.upsert({
      where: { tmdbId_media: { tmdbId: task.tmdbId, media } },
      update: { imdbId: data.imdb_id },
      create: { tmdbId: task.tmdbId, media, imdbId: data.imdb_id },
    });
    found += 1;

    if (done % 200 === 0) console.log(`[imdbmap] ${done}/${queue.length}, найдено: ${found}`);
  }

  const total = await prisma.imdbMap.count();
  console.log(`[imdbmap] обработано: ${done}, найдено: ${found}, всего: ${total}`);
}

await main();
await prisma.$disconnect();
