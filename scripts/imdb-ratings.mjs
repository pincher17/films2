/**
 * Загрузка рейтингов IMDb из официального датасета.
 *
 * Файл title.ratings.tsv.gz содержит ~1.7 млн строк: id, средняя оценка,
 * число голосов. Скачивается свободно, обновляется ежедневно.
 *
 * Берём только те фильмы, которые есть в нашей таблице соответствий IMDb:
 * заливать полтора миллиона строк незачем, нам нужны свои.
 *
 * Запуск: node scripts/imdb-ratings.mjs [путь-к-файлу]
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import readline from "readline";
import { createGunzip } from "zlib";

const prisma = new PrismaClient();
const file = process.argv[2] || "/tmp/ratings.tsv.gz";

async function main() {
  if (!fs.existsSync(file)) {
    console.error(`нет файла ${file} — скачайте https://datasets.imdbws.com/title.ratings.tsv.gz`);
    process.exit(1);
  }

  /* Нужные нам imdb id: те, что уже сопоставлены с TMDB */
  const mapped = await prisma.imdbMap.findMany({ select: { imdbId: true } });
  const needed = new Set(mapped.map((row) => row.imdbId));
  console.log(`[ratings] нужных id: ${needed.size}`);

  const stream = fs.createReadStream(file).pipe(createGunzip());
  const lines = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let seen = 0;
  let saved = 0;
  let batch = [];

  const flush = async () => {
    if (!batch.length) return;
    /* upsert по одному незачем: собираем пачками в одном запросе */
    await prisma.$transaction(
      batch.map((row) =>
        prisma.imdbRating.upsert({
          where: { imdbId: row.imdbId },
          update: { rating: row.rating, votes: row.votes },
          create: row,
        })
      )
    );
    saved += batch.length;
    batch = [];
  };

  for await (const line of lines) {
    seen += 1;
    if (seen === 1) continue; // заголовок
    const [imdbId, rating, votes] = line.split("\t");
    if (!imdbId || !needed.has(imdbId)) continue;

    batch.push({ imdbId, rating: Number(rating), votes: Number(votes) });
    if (batch.length >= 500) await flush();
  }
  await flush();

  const total = await prisma.imdbRating.count();
  console.log(`[ratings] просмотрено строк: ${seen}, сохранено: ${saved}, всего в базе: ${total}`);
}

await main();
await prisma.$disconnect();
