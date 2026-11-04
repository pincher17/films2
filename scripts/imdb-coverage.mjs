/**
 * Покрытие IMDb: собираем соответствия по всему каталогу, а не только по очереди.
 *
 * Зачем отдельный скрипт. imdbmap.mjs берёт кандидатов из TrailerTask, а очередь
 * трейлеров сеялась с 2005 года. Из-за этого «Друзья» (1994), «Коломбо» (1968)
 * и «Сайнфелд» (1989) в неё не попали: у них нет соответствия, карточка
 * остаётся без id, и каталог выбрасывает её из выдачи — на странице
 * популярных сериалов так терялось 24 карточки из 60.
 *
 * Здесь кандидаты берутся напрямую из TMDB двумя проходами:
 *   1. по популярности без ограничения по годам — то, что видно на главной;
 *   2. по годам от текущего к 1950 — то, что открывают через фильтры.
 * Порядок важен: сначала закрываем популярное, потом идём вглубь.
 *
 * Запуск:
 *   node scripts/imdb-coverage.mjs [--popular 250] [--years 10] [--minutes 45]
 *     --popular — сколько страниц discover пройти по популярности (по 20 позиций)
 *     --years   — сколько страниц на каждый год и тип
 *     --minutes — бюджет времени на запросы external_ids
 *
 * Скрипт можно запускать повторно: размеченное пропускается, поэтому каждый
 * прогон продолжает с неразмеченных и с каждым запуском уходит глубже.
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

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  if (index < 0) return fallback;
  const value = Number(args[index + 1]);
  return Number.isFinite(value) ? value : fallback;
};
const POPULAR_PAGES = arg("popular", 250);
const YEAR_PAGES = arg("years", 10);
const MINUTES = arg("minutes", 45);

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

/* Порядок каталога: массив, а не Set — важно, в каком порядке закрывать. */
function createCatalog() {
  const seen = new Set();
  const list = [];
  return {
    list,
    add(media, id) {
      const key = `${media}:${id}`;
      if (seen.has(key)) return;
      seen.add(key);
      list.push({ media, tmdbId: id });
    },
  };
}

/** Проход по популярности: главная страница и списки без фильтров. */
async function collectPopular(catalog) {
  for (const media of ["movie", "tv"]) {
    for (let page = 1; page <= POPULAR_PAGES; page += 1) {
      const data = await tmdb(`/discover/${media}`, {
        sort_by: "popularity.desc",
        page: String(page),
      });
      const results = data?.results || [];
      if (!results.length) break;
      for (const item of results) if (item.id) catalog.add(media, item.id);
      if (page % 50 === 0) console.log(`[coverage] популярное ${media}: страниц ${page}`);
      await sleep(30);
    }
  }
}

/** Проход по годам: старые фильмы и сериалы, которых нет в популярном срезе. */
async function collectByYear(catalog) {
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1950; year -= 1) {
    for (const media of ["movie", "tv"]) {
      const dateParam = media === "movie" ? "primary_release_year" : "first_air_date_year";
      for (let page = 1; page <= YEAR_PAGES; page += 1) {
        const data = await tmdb(`/discover/${media}`, {
          sort_by: "popularity.desc",
          page: String(page),
          [dateParam]: String(year),
        });
        const results = data?.results || [];
        if (!results.length) break;
        for (const item of results) if (item.id) catalog.add(media, item.id);
        await sleep(30);
      }
    }
    if (year % 10 === 0) console.log(`[coverage] годы: дошёл до ${year}, в каталоге ${catalog.list.length}`);
  }
}

async function main() {
  const started = Date.now();
  const deadline = started + MINUTES * 60 * 1000;

  console.log(
    `[coverage] собираю каталог: популярное ${POPULAR_PAGES} страниц, годы по ${YEAR_PAGES} страниц`
  );
  const catalog = createCatalog();
  await collectPopular(catalog);
  const afterPopular = catalog.list.length;
  await collectByYear(catalog);
  console.log(
    `[coverage] каталог собран: ${catalog.list.length} (популярное дало ${afterPopular})`
  );

  const mapped = new Set(
    (await prisma.imdbMap.findMany({ select: { tmdbId: true, media: true } })).map(
      (row) => `${row.media}:${row.tmdbId}`
    )
  );

  const missing = catalog.list.filter((item) => !mapped.has(`${item.media}:${item.tmdbId}`));
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

    if (found % 500 === 0) {
      const inBase = await prisma.imdbMap.count();
      console.log(`[coverage] проверено ${done}, найдено ${found}, в базе ${inBase}`);
    }

    await sleep(40);
  }

  const inBase = await prisma.imdbMap.count();
  console.log(
    `[coverage] готово: проверено ${done}, найдено ${found}, без imdb в TMDB ${withoutImdb}` +
      `${stoppedByTime ? ", остановлен по времени" : ""}, в базе ${inBase}`
  );
  if (stoppedByTime) {
    console.log(`[coverage] не проверено в этот раз: ${missing.length - done} — продолжит в следующий`);
  }
}

await main();
await prisma.$disconnect();
