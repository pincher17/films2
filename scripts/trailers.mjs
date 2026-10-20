/**
 * Трейлеры: наполнение очереди и постепенная обработка.
 *
 * Запуск:
 *   node scripts/trailers.mjs seed      — собрать очередь из TMDB
 *   node scripts/trailers.mjs work 100  — обработать 100 задач
 *   node scripts/trailers.mjs stats     — показать состояние
 *
 * Логика обработки одной задачи:
 *   1. TMDB: есть трейлер с языком ru  → сохраняем (квота YouTube не тратится)
 *   2. иначе YouTube: поиск «название год трейлер» → оценка результата
 *   3. не прошло порог → статус «skipped» с причиной
 *
 * Только русские трейлеры: владелец сайта попросил не подставлять английские.
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// ключи читаем из .env.local, как это делает Next
function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) process.env[match[1]] ??= match[2].trim().replace(/^"|"$/g, "");
  }
}
loadEnv();

const TMDB = process.env.TMDB_KEY;
/* Ключей может быть несколько: когда у одного кончилась дневная квота,
   переключаемся на следующий. В .env.local перечислите их через запятую
   в YOUTUBE_API_KEYS, либо оставьте один в YOUTUBE_API_KEY. */
const KEYS = (process.env.YOUTUBE_API_KEYS || process.env.YOUTUBE_API_KEY || "")
  .split(",")
  .map((key) => key.trim())
  .filter(Boolean);
let keyIndex = 0;

/** Запрос к YouTube с автоматическим переключением ключа при лимите. */
async function yt(pathAndQuery) {
  while (keyIndex < KEYS.length) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/${pathAndQuery}&key=${KEYS[keyIndex]}`
    );
    const data = await response.json();
    const reason = data?.error?.errors?.[0]?.reason || "";
    if (reason === "quotaExceeded" || reason === "dailyLimitExceeded" || reason === "rateLimitExceeded") {
      console.warn(
        `[work] дневной лимит у ключа ${keyIndex + 1} из ${KEYS.length} — переключаюсь`
      );
      keyIndex += 1;
      continue;
    }
    return data;
  }
  return { error: { message: "дневной лимит у всех ключей" } };
}

const norm = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[«»"'()]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

async function tmdb(pathName, params = {}) {
  const query = new URLSearchParams({ api_key: TMDB, language: "ru-RU", ...params });
  const response = await fetch(`https://api.themoviedb.org/3${pathName}?${query}`);
  return response.json();
}

/** Собираем очередь из популярного, трендов и новинок. */
async function seed() {
  /* В очередь берём фильмы и сериалы с 2005 года и без
     ток-шоу, новостей и реалити: трейлер к передаче 1958 года никому не нужен,
     а квоту YouTube мы тратим ограниченно. */
  const COMMON = {
    "primary_release_date.gte": "2005-01-01",
    "first_air_date.gte": "2005-01-01",
    // 10767 — ток-шоу, 10763 — новости, 10764 — реалити, 10766 — мыло
    without_genres: "10767,10763,10764,10766",
    sort_by: "popularity.desc",
  };

  /* Страниц берём с запасом: каждая страница — 20 позиций, лимит TMDB — 500.
     Глубину можно увеличивать, скрипт не создаёт дублей (filmId уникален). */
  /* Тип задаём явно для каждого источника: угадывание по данным оказывалось
     ненадёжным, а ошибка в типе ведёт к чужим трейлерам (у TMDB разные
     нумерации для фильмов и сериалов). */
  const sources = [
    ["/discover/movie", 25, COMMON, "movie"],
    ["/discover/tv", 25, COMMON, "tv"],
    ["/trending/all/week", 5, null, null],
    ["/movie/now_playing", 3, null, "movie"],
  ];

  let added = 0;
  for (const [endpoint, pages, params, fixedMedia] of sources) {
    for (let page = 1; page <= pages; page += 1) {
      const data = await tmdb(endpoint, { page: String(page), ...(params || {}) });
      for (const item of data.results || []) {
        const media = fixedMedia || (item.media_type === "tv" ? "tv" : "movie");
        const title = item.title || item.name || item.original_title || item.original_name;
        if (!item.id || !title) continue;
        const year = Number(String(item.release_date || item.first_air_date || "").slice(0, 4)) || null;

        await prisma.trailerTask.upsert({
          where: { filmId_media: { filmId: item.id, media } },
          update: { popularity: item.popularity || 0 },
          create: {
            filmId: item.id,
            tmdbId: item.id,
            media,
            title,
            year,
            popularity: item.popularity || 0,
          },
        });
        added += 1;
      }
    }
  }
  console.info(`[seed] обработано позиций: ${added}`);
}

/** Оценка найденного видео на YouTube: 0 — не брать. */
function scoreVideo(video, title) {
  const snippet = video.snippet || {};
  const videoTitle = norm(snippet.title);
  const wanted = norm(title);
  let score = 0;

  if (wanted && videoTitle.includes(wanted)) score += 2;
  else if (wanted && wanted.split(" ").every((word) => videoTitle.includes(word))) score += 1;
  else return 0;

  // отсекаем обзоры, реакции и разборы — это не трейлеры
  if (/обзор|реакц|разбор|рецензи|летсплей|прохожден/.test(videoTitle)) return 0;
  if (/трейлер|trailer|тизер|teaser/.test(videoTitle)) score += 1;
  if (/русск|ru|russian|дубл/.test(videoTitle)) score += 2;
  if (/официальн|official/.test(norm(snippet.channelTitle))) score += 1;
  if (/трейлеры|trailers|кино/i.test(snippet.channelTitle || "")) score += 1;

  return score;
}

/** Обработка порции задач. */
async function work(limit = 100) {
  let searches = 0;
  const tasks = await prisma.trailerTask.findMany({
    where: { status: "pending" },
    orderBy: { popularity: "desc" },
    take: limit,
  });

  console.info(`[work] задач в порции: ${tasks.length}`);

  for (const task of tasks) {
    try {
      // 1. ищем русский трейлер в TMDB
      if (task.tmdbId) {
        const videos = await tmdb(`/${task.media || "movie"}/${task.tmdbId}/videos`);
        const russian = (videos.results || []).filter(
          (v) => v.site === "YouTube" && v.iso_639_1 === "ru" && /Trailer|Teaser/i.test(v.type)
        );
        if (russian.length) {
          const best = russian[0];
          await prisma.trailer.upsert({
            where: {
              filmId_media_youtubeId: {
                filmId: task.filmId,
                media: task.media || "movie",
                youtubeId: best.key,
              },
            },
            update: {},
            create: {
              filmId: task.filmId,
              media: task.media || "movie",
              youtubeId: best.key,
              title: best.name,
              lang: "ru",
              source: "tmdb",
            },
          });
          await prisma.trailerTask.update({
            where: { id: task.id },
            data: { status: "done", note: "TMDB (ru)" },
          });
          continue;
        }
      }

      // 2. YouTube
      if (!YT) {
        await prisma.trailerTask.update({ where: { id: task.id }, data: { status: "skipped", note: "нет ключа YouTube" } });
        continue;
      }

      const query = `${task.title} ${task.year || ""} трейлер`;
      const search = await yt(
        `search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query)}`
      );
      searches += 1;

      if (search.error) {
        // лимит кончился — дальше идти бессмысленно, оставляем задачи в очереди
        if (/лимит/.test(search.error.message || "")) {
          console.warn("[work] останавливаюсь:", search.error.message);
          break;
        }
        console.warn("[work] YouTube:", search.error.message);
        await prisma.trailerTask.update({
          where: { id: task.id },
          data: { status: "failed", note: search.error.message.slice(0, 120), attempts: { increment: 1 } },
        });
        continue;
      }

      const scored = (search.items || [])
        .map((video) => ({ video, score: scoreVideo(video, task.title) }))
        .filter((item) => item.score >= 4)
        .sort((a, b) => b.score - a.score);

      if (!scored.length) {
        await prisma.trailerTask.update({
          where: { id: task.id },
          data: { status: "skipped", note: "подходящего не нашлось", attempts: { increment: 1 } },
        });
        continue;
      }

      // Проверяем встраиваемость точечно: фильтр в поиске отсекал почти всё,
      // а этот запрос стоит 1 единицу и даёт точный ответ.
      let best = null;
      for (const candidate of scored) {
        const videoId = candidate.video.id?.videoId;
        if (!videoId) continue;
        const details = await yt(`videos?part=status,contentDetails&id=${videoId}`);
        const info = details.items?.[0];
        if (!info || info.status?.embeddable === false) continue;
        // отсекаем shorts и слишком длинные ролики
        const duration = info.contentDetails?.duration || "";
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const seconds = match
          ? (Number(match[1] || 0) * 3600) + (Number(match[2] || 0) * 60) + Number(match[3] || 0)
          : 0;
        if (seconds < 20 || seconds > 900) continue;
        best = candidate.video;
        break;
      }

      if (!best) {
        await prisma.trailerTask.update({
          where: { id: task.id },
          data: { status: "skipped", note: "нет подходящего для встраивания", attempts: { increment: 1 } },
        });
        continue;
      }
      await prisma.trailer.upsert({
        where: {
          filmId_media_youtubeId: {
            filmId: task.filmId,
            media: task.media || "movie",
            youtubeId: best.id.videoId,
          },
        },
        update: {},
        create: {
          filmId: task.filmId,
          media: task.media || "movie",
          youtubeId: best.id.videoId,
          title: best.snippet.title,
          lang: "ru",
          source: "youtube",
        },
      });
      await prisma.trailerTask.update({
        where: { id: task.id },
        data: { status: "done", note: `YouTube (${scored[0].score})` },
      });
    } catch (error) {
      await prisma.trailerTask.update({
        where: { id: task.id },
        data: { status: "failed", note: String(error?.message || error).slice(0, 120), attempts: { increment: 1 } },
      });
    }
  }

  // итоги порции: пригодятся в отчёте
  const summary = await prisma.trailerTask.groupBy({ by: ["status"], _count: true });
  const counts = Object.fromEntries(summary.map((row) => [row.status, row._count]));
  const trailers = await prisma.trailer.count();

  console.info(`[work] поисков YouTube: ${searches}`);
  console.info(
    `[work] итог: готово ${counts.done || 0}, пропущено ${counts.skipped || 0}, ` +
      `ошибок ${counts.failed || 0}, в очереди ${counts.pending || 0}, всего трейлеров ${trailers}`
  );

  await sendReport({ searches, counts, trailers, keys: KEYS.length });
}

async function stats() {
  const byStatus = await prisma.trailerTask.groupBy({ by: ["status"], _count: true });
  const trailers = await prisma.trailer.count();
  console.info("в очереди:");
  for (const row of byStatus) console.info(`  ${row.status}: ${row._count}`);
  console.info(`найдено трейлеров: ${trailers}`);
}

/**
 * Отчёт в Telegram. Тихо пропускаем, если токена или чата нет:
 * скрипт должен работать и без уведомлений.
 */
async function sendReport({ searches, counts, trailers, keys }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  let chatId = null;
  try {
    chatId = fs.readFileSync("/root/.filmhub-tg-chat", "utf8").trim();
  } catch {
    return;
  }

  const text = [
    "Трейлеры: порция обработана",
    `поисков YouTube: ${searches} (ключей: ${keys})`,
    `готово: ${counts.done || 0}`,
    `пропущено: ${counts.skipped || 0}`,
    `ошибок: ${counts.failed || 0}`,
    `в очереди: ${counts.pending || 0}`,
    `всего трейлеров: ${trailers}`,
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

const [command, arg] = process.argv.slice(2);
if (command === "seed") await seed();
else if (command === "work") await work(Number(arg) || 100);
else if (command === "stats") await stats();
else console.info("использование: seed | work <n> | stats");

await prisma.$disconnect();
