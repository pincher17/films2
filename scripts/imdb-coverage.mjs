/**
 * Покрытие IMDb: собираем соответствия по всему каталогу, а не только по очереди.
 *
 * Зачем отдельный скрипт. imdbmap.mjs берёт кандидатов из TrailerTask, а очередь
 * трейлеров сеялась с 2005 года. Из-за этого «Друзья» (1994), «Коломбо» (1968)
 * и «Сайнфелд» (1989) в неё не попали: у них нет соответствия, карточка
 * остаётся без id, и каталог выбрасывает её из выдачи — на странице
 * популярных сериалов так терялось 24 карточки из 60.
 *
 * Здесь кандидаты берутся напрямую из TMDB: обходим discover по популярности
 * и сохраняем imdb id для всего, чего ещё нет в таблице. Порядок — от самых
 * популярных, чтобы первые запуски закрывали то, что реально видно на сайте.
 *
 * Запуск:
 *   node scripts/imdb-coverage.mjs [страниц] [минут]
 *     страниц — сколько страниц discover пройти (по 20 позиций), по умолчанию 120
 *     минут   — бюджет времени на запросы external_ids, по умолчанию 25
 *
 * Скрипт можно запускать повторно: уже размеченное пропускается, так что
 * каждый прогон продолжает с того места, где кончился предыдущий.
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
const PAGES = Number(process.argv[2]) || 120;
const MINUTES = Number(process.argv[3]) || 25;

if (!TMDB) {
  console.error("нет TMDB_KEY в .env.local");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function tmdb(pathName, params = {}) {
  const query = new URLSearchParams({ api_key: TMDB, language: "ru-RU", ...params });
  const response = await fetch(`https://api.themoviedb.org/3${pathName}?${query}`);
  if (!response.ok) return null;
  return response.json();
}

/** Собираем id каталога из discover: по популярности, без ограничения по годам. */
async function collectCatalog() {
  const ids = { movie: new Set(), tv: new Set() };

  for (const media of ["movie", "tv"]) {
    for (let page = 1; page <= PAGES; page += 1) {
      const data = await tmdb(`/discover/${media}`, {
        sort_by: "popularity.desc",
        page: String(page),
      });
      const results = data?.results || [];
      if (!results.length) break;
      for (const item of results) if (item.id) ids[media].add(item.id);

      if (page % 20 === 0) {
        console.log(`[coverage] ${media}: страниц ${page}, id ${ids[media].size}`);
      }
      await sleep(30);
    }
  }

  return ids;
}

async function main() {
  const started = Date.now();
  const deadline = started + MINUTES * 60 * 1000;

  console.log(`[coverage] собираю каталог: ${PAGES} страниц на тип`);
  const ids = await collectCatalog();
  const total = ids.movie.size + ids.tv.size;
  console.log(`[coverage] в каталоге: фильмов ${ids.movie.size}, сериалов ${ids.tv.size}, всего ${total}`);

  const mapped = new Set(
    (await prisma.imdbMap.findMany({ select: { tmdbId: true, media: true } })).map(
      (row) => `${row.media}:${row.tmdbId}`
    )
  );

  const missing = [];
  for (const media of ["movie", "tv"]) {
    for (const id of ids[media]) {
      if (!mapped.has(`${media}:${id}`)) missing.push({ media, tmdbId: id });
    }
  }
  console.log(`[coverage] без соответствия: ${missing.length}`);

  let done = 0;
  let found = 0;
  let withoutImdb = 0;
  let stoppedByTime = false;

  for (const item of missing) {
    if (Date.now() > deadline) {
      stoppedByTime = true;
      break;
    }

    const data = await tmdb(`/${item.media}/${item.tmdbId}/external_ids`);
    done += 1;

    if (!data?.imdb_id) {
      withoutImdb += 1;
      await sleep(40);
      continue;
    }

    await prisma.imdbMap.upsert({
      where: { tmdbId_media: { tmdbId: item.tmdbId, media: item.media } },
      update: { imdbId: data.imdb_id },
      create: { tmdbId: item.tmdbId, media: item.media, imdbId: data.imdb_id },
    });
    found += 1;

    if (found % 200 === 0) {
      const total2 = await prisma.imdbMap.count();
      console.log(`[coverage] проверено ${done}, найдено ${found}, всего в базе ${total2}`);
    }

    await sleep(40);
  }

  const inBase = await prisma.imdbMap.count();
  console.log(
    `[coverage] готово: проверено ${done}, найдено ${found}, без imdb в TMDB ${withoutImdb}` +
      `${stoppedByTime ? ", остановлен по времени" : ""}, в базе ${inBase}`
  );
  if (stoppedByTime) {
    console.log("[coverage] запустите снова — продолжит с неразмеченных");
  }
}

await main();
await prisma.$disconnect();
