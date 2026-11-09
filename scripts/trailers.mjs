/**
 * Трейлеры: наполнение очереди и постепенная обработка.
 *
 * Запуск:
 *   node scripts/trailers.mjs seed      — собрать очередь из TMDB
 *   node scripts/trailers.mjs work 100  — обработать 100 задач
 *   node scripts/trailers.mjs stats     — показать состояние
 *
 * Логика обработки одной задачи:
 *   1. TMDB: есть трейлер с языком ru  → сохраняем (YouTube не трогаем)
 *   2. иначе YouTube: поиск «название год трейлер» → оценка результата
 *   3. не прошло порог → статус «skipped» с причиной
 *
 * Только русские трейлеры: владелец сайта попросил не подставлять английские.
 *
 * Поиск идёт без API-ключа (см. yt-search.mjs). Причина: у Data API квота
 * 10 000 единиц на проект в сутки, а один search.list стоит 100 единиц —
 * это ~465 поисков на пять ключей и стоп на неделю. Нам нужно 10 656 задач,
 * поэтому страница поиска разбирается напрямую: квоты у этого пути нет.
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { searchYouTube, oembed } from "./yt-search.mjs";

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

/** Пауза между запросами: без неё YouTube быстро начинает отвечать 429. */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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



/** Догоняет id у трейлеров, сохранённых до появления колонок tmdbId/imdbId/kpId. */
async function linkIds() {
  const tmdb = await prisma.$executeRaw`UPDATE "Trailer" SET "tmdbId" = "filmId" WHERE "tmdbId" IS NULL`;
  const imdb = await prisma.$executeRaw`
    UPDATE "Trailer" t SET "imdbId" = m."imdbId"
    FROM "ImdbMap" m
    WHERE m."tmdbId" = t."tmdbId" AND m.media = t.media AND t."imdbId" IS NULL`;
  const kp = await prisma.$executeRaw`
    UPDATE "Trailer" t SET "kpId" = k."kpId"
    FROM "KpMap" k
    WHERE k."tmdbId" = t."tmdbId" AND k.media = t.media AND t."kpId" IS NULL`;
  console.info(`[link-ids] tmdb ${tmdb}, imdb ${imdb}, kp ${kp}`);
}

/**
 * Наполнение очереди из каталога.
 *
 * seed/seed-deep идут по выдаче TMDB (топ по популярности по годам) и упираются
 * в её глубину: за 20 страниц на год новые фильмы уже не достаются. Здесь
 * берём сам каталог — пары из ImdbMap, которые заполнялись по страницам сайта,
 * и добавляем всё, чего в очереди ещё нет.
 *
 * Название и год нужны для поиска на YouTube, поэтому тянем их из TMDB: одно
 * обращение на фильм, пачками по 50.
 */

/** Все три идентификатора трейлера: tmdb, imdb и кинопоиск. */
async function trailerIds(task) {
  const tmdbId = Number(task.tmdbId || task.filmId) || null;
  const media = task.media || "movie";
  if (!tmdbId) return { tmdbId: null, imdbId: null, kpId: null };

  const [imdb, kp] = await Promise.all([
    prisma.imdbMap
      .findUnique({ where: { tmdbId_media: { tmdbId, media } }, select: { imdbId: true } })
      .catch(() => null),
    prisma.kpMap
      .findUnique({ where: { tmdbId_media: { tmdbId, media } }, select: { kpId: true } })
      .catch(() => null),
  ]);

  return { tmdbId, imdbId: imdb?.imdbId || null, kpId: kp?.kpId || null };
}

async function seedMap(limit = 0) {
  const rows = await prisma.$queryRaw`
    SELECT m."tmdbId"::int AS "tmdbId", m.media::text AS media
    FROM "ImdbMap" m
    LEFT JOIN "TrailerTask" t
      ON t."filmId" = m."tmdbId" AND t.media = m.media
    WHERE t.id IS NULL
    LIMIT ${limit > 0 ? limit : 1000000}
  `;

  console.info(`[seed-map] кандидатов: ${rows.length}`);
  if (!rows.length) return;

  const CHUNK = 50;
  let added = 0;
  let gone = 0;

  for (let start = 0; start < rows.length; start += CHUNK) {
    const chunk = rows.slice(start, start + CHUNK);
    const details = await Promise.all(
      chunk.map(async (row) => {
        const data = await tmdb(row.media === "tv" ? `/tv/${row.tmdbId}` : `/movie/${row.tmdbId}`);
        if (!data || !data.id) return null;
        const title = data.title || data.name || data.original_title || data.original_name;
        if (!title) return null;
        return {
          filmId: row.tmdbId,
          tmdbId: row.tmdbId,
          media: row.media,
          title,
          year: Number(String(data.release_date || data.first_air_date || "").slice(0, 4)) || null,
          popularity: data.popularity || 0,
        };
      })
    );

    const found = details.filter(Boolean);
    gone += details.length - found.length;
    if (found.length) {
      const result = await prisma.trailerTask.createMany({ data: found, skipDuplicates: true });
      added += result.count;
    }

    const done = Math.min(start + CHUNK, rows.length);
    if (done % 500 === 0 || done === rows.length) {
      console.info(`[seed-map] ${done}/${rows.length}, добавлено ${added}`);
    }
  }

  console.info(`[seed-map] итог: добавлено ${added}, без данных в TMDB ${gone}`);
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

/**
 * Название встречается только как дата проката — значит это чужой трейлер.
 *
 * Пример: фильм «5 сентября», а ролик называется «Ускорение 2024 | в кино
 * с 5 сентября». Название совпало целиком, но это дата выхода другого фильма.
 * Отдельно ловим случай, когда перед нашей датой стоит цифра: «15 сентября»
 * не должно совпадать с названием «5 сентября».
 */
function releaseDateArtifact(videoTitle, wanted) {
  const at = videoTitle.indexOf(wanted);
  if (at < 0) return false;

  // «15 сентября» — не «5 сентября»
  if (/\d/.test(videoTitle[at - 1] || "")) return true;

  // «в кино с 5 сентября», «премьера с 5 сентября», «с 5 сентября»
  const before = videoTitle.slice(Math.max(0, at - 20), at).trim();
  return /(^|\s)с$|в кино$|премьера$|на экранах$|выходит$/.test(before);
}

/** Оценка найденного видео на YouTube: 0 — не брать. */
function scoreVideo(video, title, year) {
  const videoTitle = norm(video.title);
  const wanted = norm(title);
  if (!wanted) return 0;

  // мусор вместо трейлера
  if (/обзор|реакц|разбор|рецензи|летсплей|прохожден|прикол|смешн/.test(videoTitle)) return 0;

  /* Ролик честно предупреждает, что он не на русском — такие не берём,
     даже если всё остальное в названии по-русски. */
  if (/на английском|в оригинале|на языке оригинала/.test(videoTitle)) return 0;

  // должен быть трейлер
  if (!/трейлер|trailer|тизер|teaser/.test(videoTitle)) return 0;

  // название фильма должно встречаться в ролике
  if (!videoTitle.includes(wanted)) return 0;

  /* Дата проката в чужом ролике — не наше название */
  if (releaseDateArtifact(videoTitle, wanted)) return 0;

  /* Спин-офф: «Мыслить как преступник: Эволюция» — другой сериал. Если после
     названия идёт двоеточие или тире и дальше посторонние слова — отклоняем. */
  const after = videoTitle.slice(videoTitle.indexOf(wanted) + wanted.length).trim();
  const separator = after.search(/[:—–-]/);
  if (separator > -1) {
    const tail = after.slice(separator + 1).trim();
    const allowedTail = /^(трейлер|trailer|тизер|teaser|русск|russian|дубл|сезон|серия|hd|4k|\d{4}|\s)*$/;
    if (tail && !allowedTail.test(tail)) return 0;
  }

  let score = 2;

  /* Год: если в названии ролика он есть и отличается от нашего — другой фильм. */
  const years = videoTitle.match(/\b(19|20)\d{2}\b/g) || [];
  if (year && years.length) {
    if (years.some((value) => Math.abs(Number(value) - Number(year)) <= 1)) score += 1;
    else return 0;
  }

  /* Русский: если в названии больше кириллицы, чем латиницы, это русский
     ролик — даже без слова «русский». Раньше такие отбраковывались. */
  const cyrillic = (videoTitle.match(/[а-яё]/g) || []).length;
  const latin = (videoTitle.match(/[a-z]/g) || []).length;
  const russian = cyrillic > latin || /русск|russian|дубл/.test(videoTitle);
  /* Английский ролик на сайт не берём ни при каких бонусах: раньше он проходил
     за счёт года и «официального» канала. */
  if (!russian) return 0;
  score += 2;

  if (/официальн|official/.test(norm(video.channel))) score += 1;
  if (/трейлеры|trailers|кино/i.test(video.channel || "")) score += 1;

  return score;
}


/** Обработка порции задач. */
async function work(limit = 100) {
  let searches = 0;
  let emptyStreak = 0;
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
          /* Трейлер есть в TMDB — копировать его в нашу базу не нужно:
             страница фильма берёт его оттуда при показе. Достаточно отметить,
             что задача закрыта, и не тратить на неё квоту YouTube. */
          await prisma.trailerTask.update({
            where: { id: task.id },
            data: { status: "done", note: "есть в TMDB (ru)" },
          });
          continue;
        }
      }

      // 2. YouTube без ключа и без квоты
      await sleep(250); // без паузы YouTube быстро начинает отвечать 429
      const query = `${task.title} ${task.year || ""} трейлер`;
      let results;
      try {
        results = await searchYouTube(query);
      } catch (error) {
        searches += 1;
        emptyStreak += 1;
        console.warn(`[work] поиск не удался (${error.status || "?"}): ${error.message}`);
        await prisma.trailerTask.update({
          where: { id: task.id },
          data: { status: "failed", note: String(error.message).slice(0, 120), attempts: { increment: 1 } },
        });
        /* Если YouTube закрыл дверь, долбить дальше бессмысленно: задачи
           остаются в очереди и вернутся в следующий прогон. */
        if (emptyStreak >= 5) {
          console.warn("[work] пять ошибок подряд — останавливаюсь, очередь сохранена");
          break;
        }
        await sleep(5000);
        continue;
      }
      searches += 1;
      emptyStreak = 0;

      /* Длительность уже есть в выдаче, поэтому shorts и двухчасовые ролики
         отсекаем сразу — без лишних запросов. */
      const scored = results
        .map((video) => ({ video, score: scoreVideo(video, task.title, task.year) }))
        .filter(
          (item) => item.score >= 4 && item.video.durationSec >= 20 && item.video.durationSec <= 900
        )
        .sort((a, b) => b.score - a.score);

      if (!scored.length) {
        await prisma.trailerTask.update({
          where: { id: task.id },
          data: { status: "skipped", note: "подходящего не нашлось", attempts: { increment: 1 } },
        });
        continue;
      }

      /* Встраиваемость проверяем через oembed: он бесплатный и отвечает
         ошибкой для роликов, которые встроить нельзя. */
      let best = null;
      for (const candidate of scored.slice(0, 3)) {
        if (await oembed(candidate.video.videoId)) {
          best = candidate.video;
          break;
        }
        await sleep(200);
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
            youtubeId: best.videoId,
          },
        },
        update: {},
        create: {
          filmId: task.filmId,
          media: task.media || "movie",
          youtubeId: best.videoId,
          title: best.title,
          lang: "ru",
          ...(await trailerIds(task)),
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

  await sendReport({ searches, counts, trailers });
}


/**
 * Глубокий сбор: проходим по годам и набираем популярное в каждом.
 * Так очередь покрывает весь каталог, а не только свежее.
 */
async function seedDeep(fromYear = 2005, pages = 20) {
  const currentYear = new Date().getFullYear();
  let added = 0;

  console.info(`[seed-deep] годы ${currentYear}…${fromYear}, по ${pages} страниц`);
  for (let year = currentYear; year >= fromYear; year -= 1) {
    for (const media of ["movie", "tv"]) {
      const dateParam = media === "movie" ? "primary_release_year" : "first_air_date_year";
      for (let page = 1; page <= pages; page += 1) {
        const data = await tmdb(`/discover/${media}`, {
          page: String(page),
          sort_by: "popularity.desc",
          [dateParam]: String(year),
          // без ток-шоу, новостей, реалити и мыла
          without_genres: "10767,10763,10764,10766",
        });
        const results = data.results || [];
        if (!results.length) break;

        for (const item of results) {
          if (!item.id) continue;
          const title = item.title || item.name || item.original_title || item.original_name;
          if (!title) continue;
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
    console.info(`[seed-deep] ${year}: всего ${added}`);
  }
}

/**
 * Проверка уже сохранённых трейлеров: не подставили ли дату проката чужого
 * фильма вместо нашего названия. Без --fix только показывает, с --fix удаляет
 * ошибочный трейлер и возвращает задачу в очередь.
 */
async function audit(apply = false) {
  const trailers = await prisma.trailer.findMany({
    select: { id: true, filmId: true, media: true, youtubeId: true, title: true },
  });

  const bad = [];
  for (const trailer of trailers) {
    const task = await prisma.trailerTask.findFirst({
      where: { filmId: trailer.filmId, media: trailer.media || "movie" },
      select: { id: true, title: true },
    });
    if (!task?.title) continue;
    if (!releaseDateArtifact(norm(trailer.title || ""), norm(task.title))) continue;
    bad.push({ trailer, task });
  }

  console.log(`[audit] проверено ${trailers.length}, подозрительных ${bad.length}`);
  for (const { trailer, task } of bad) {
    console.log(
      `  ${trailer.filmId} «${task.title}» <- ${trailer.youtubeId} | ${String(trailer.title).slice(0, 70)}`
    );
  }

  if (!apply || !bad.length) return;
  for (const { trailer, task } of bad) {
    await prisma.trailer.delete({ where: { id: trailer.id } });
    await prisma.trailerTask.update({
      where: { id: task.id },
      data: { status: "pending", note: "дата проката в чужом ролике", attempts: { increment: 1 } },
    });
  }
  console.log(`[audit] удалено ${bad.length}, задачи вернулись в очередь`);
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
async function sendReport({ searches, counts, trailers }) {
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
    `поисков YouTube: ${searches} (без ключа)`,
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
else if (command === "seed-deep") await seedDeep(Number(arg) || 2005, Number(process.argv[4]) || 20);
else if (command === "seed-map") await seedMap(Number(arg) || 0);
else if (command === "link-ids") await linkIds();
else if (command === "work") await work(Number(arg) || 100);
else if (command === "stats") await stats();
else if (command === "audit") await audit(process.argv[3] === "--fix");
else console.info("использование: seed | seed-deep [отГода] [страниц] | seed-map [сколько] | link-ids | work <n> | stats | audit [--fix]");

await prisma.$disconnect();
