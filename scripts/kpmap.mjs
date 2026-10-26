/**
 * Наполнение соответствий TMDB ↔ Кинопоиск через платную API Кинопоиска.
 *
 * Зачем: каталог показывает только фильмы с кинопоисковым id — иначе карточку
 * некуда вести при клике. Wikidata знает далеко не всё, особенно для
 * зарубежных сериалов.
 *
 * Логика: берём фильмы из очереди трейлеров (они же — каталог сайта), ищем
 * название на Кинопоиске и сверяем по полю externalId.tmdb. Совпадение по
 * TMDB id — точное, в отличие от сверки по названию.
 *
 * Запуск: node scripts/kpmap.mjs [сколько запросов]
 * Дневной лимит API — 200 запросов.
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

const KEY = process.env.KINOPOISK_API_KEY;
const LIMIT = Number(process.argv[2]) || 200;

if (!KEY) {
  console.error("нет KINOPOISK_API_KEY в .env.local");
  process.exit(1);
}

/** Поиск на Кинопоиске по названию */
async function search(title) {
  const response = await fetch(
    `https://api.poiskkino.dev/v1.4/movie/search?query=${encodeURIComponent(title)}&limit=10`,
    { headers: { "X-API-KEY": KEY } }
  );
  if (!response.ok) {
    return { error: `HTTP ${response.status}`, docs: [] };
  }
  return response.json();
}

async function main() {
  /* Кандидаты — фильмы из очереди, у которых ещё нет соответствия.
     Сортируем по популярности: сначала то, что люди ищут. */
  const mapped = new Set(
    (await prisma.kpMap.findMany({ select: { tmdbId: true, media: true } })).map(
      (row) => `${row.media}:${row.tmdbId}`
    )
  );

  /* Половину бюджета отдаём фильмам, половину сериалам: иначе по
     популярности в топе только фильмы, а сериалы остаются без id. */
  const takeFor = async (media, limit) => {
    const rows = await prisma.trailerTask.findMany({
      where: { status: { not: "skipped" }, media },
      orderBy: { popularity: "desc" },
      take: limit * 4,
      select: { tmdbId: true, media: true, title: true, year: true },
    });
    return rows
      .filter((task) => task.tmdbId && task.title)
      .filter((task) => !mapped.has(`${task.media || "movie"}:${task.tmdbId}`))
      .slice(0, limit);
  };

  const half = Math.ceil(LIMIT / 2);
  const queue = [...(await takeFor("movie", half)), ...(await takeFor("tv", LIMIT - half))];

  console.log(`[kpmap] кандидатов: ${queue.length}, лимит запросов: ${LIMIT}`);

  let requests = 0;
  let found = 0;

  for (const task of queue) {
    if (requests >= LIMIT) break;

    const data = await search(task.title);
    requests += 1;

    if (data.error) {
      console.warn("[kpmap]", data.error, "— останавливаюсь");
      break;
    }

    /* Ищем запись, у которой TMDB id совпадает с нашим: это точная сверка,
       название может отличаться («Клан Сопрано» / «The Sopranos») */
    const match = (data.docs || []).find(
      (item) => Number(item.externalId?.tmdb) === Number(task.tmdbId)
    );

    if (!match) continue;

    await prisma.kpMap.upsert({
      where: { tmdbId_media: { tmdbId: task.tmdbId, media: task.media || "movie" } },
      update: { kpId: match.id, title: match.name || task.title, year: match.year || task.year },
      create: {
        tmdbId: task.tmdbId,
        media: task.media || "movie",
        kpId: match.id,
        title: match.name || task.title,
        year: match.year || task.year,
      },
    });
    found += 1;
  }

  const total = await prisma.kpMap.count();
  console.log(`[kpmap] запросов: ${requests}, найдено: ${found}, всего в базе: ${total}`);

  await sendReport({ requests, found, total });
}

/** Отчёт в Telegram: тихо пропускаем, если токена или чата нет */
async function sendReport({ requests, found, total }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  let chatId = null;
  try {
    chatId = fs.readFileSync("/root/.filmhub-tg-chat", "utf8").trim();
  } catch {
    return;
  }
  const text = [
    "Кинопоиск: соответствия обновлены",
    `запросов: ${requests}`,
    `найдено: ${found}`,
    `всего в базе: ${total}`,
  ].join("\n");
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch {
    undefined;
  }
}

await main();
await prisma.$disconnect();
