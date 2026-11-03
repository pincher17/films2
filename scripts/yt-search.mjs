/**
 * Поиск на YouTube без API-ключа и без квоты.
 *
 * Зачем: у YouTube Data API дневная квота 10 000 единиц на проект, а один
 * search.list стоит 100 единиц — это ~100 поисков в день на проект. Нам нужно
 * 10 656, поэтому идём тем же путём, что и браузер:
 *
 *   основной  — POST на youtubei/v1/search: это тот же поиск, которым
 *               пользуется сам сайт YouTube. Ответ — JSON, ~0,6 МБ, без
 *               страницы согласия и без редиректов;
 *   запасной  — обычная страница /results с разбором ytInitialData
 *               (на случай, если внутренний адрес изменится).
 *
 * Дополнительно oembed(): бесплатная проверка, что ролик существует и разрешён
 * к встраиванию — для закрытых и удалённых ответ 401/404.
 *
 * Проверено с сервера: 50 запросов подряд, 0 сбоев, ~0,9 с на запрос.
 */

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Ключ и версия клиента — публичные значения, которые YouTube сам отдаёт в
   своей странице. Держим в памяти: нужны для внутреннего поиска. */
let client = null;

async function loadClient() {
  if (client) return client;
  const response = await fetch("https://www.youtube.com/results?search_query=test", {
    headers: { "User-Agent": UA, "Accept-Language": "ru-RU,ru;q=0.9" },
  });
  if (!response.ok) throw new Error(`YouTube ответил ${response.status} на стартовую страницу`);
  const html = await response.text();
  const key = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1];
  const version = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1];
  if (!key || !version) throw new Error("в странице YouTube нет ключа клиента");
  client = { key, version };
  return client;
}

/** Вырезает из HTML объект ytInitialData (с учётом вложенных фигурных скобок). */
function extractInitialData(html) {
  const marker = html.indexOf("ytInitialData");
  if (marker < 0) return null;
  const start = html.indexOf("{", marker);
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < html.length; i += 1) {
    const char = html[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

const text = (value) =>
  value?.simpleText ?? value?.runs?.map((run) => run.text).join("") ?? "";

/** «2:31» или «1:02:03» → секунды. */
function parseLength(value) {
  if (!value) return 0;
  const parts = String(value).split(":").map(Number);
  if (parts.some((part) => Number.isNaN(part))) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

/** Рекурсивно собираем все videoRenderer из дерева. */
function collectVideos(node, out) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const item of node) collectVideos(item, out);
    return;
  }
  if (node.videoRenderer) {
    const v = node.videoRenderer;
    if (v.videoId) {
      out.push({
        videoId: v.videoId,
        title: text(v.title),
        channel: text(v.ownerText) || text(v.longBylineText),
        duration: v.lengthText?.simpleText || "",
        durationSec: parseLength(v.lengthText?.simpleText),
        published: v.publishedTimeText?.simpleText || "",
        views: text(v.viewCountText),
      });
    }
  }
  for (const key of Object.keys(node)) {
    if (key === "videoRenderer") continue;
    collectVideos(node[key], out);
  }
}

/** Убираем дубликаты: один рендерер может встретиться в нескольких блоках. */
function unique(videos) {
  const seen = new Set();
  return videos.filter((video) => {
    if (seen.has(video.videoId)) return false;
    seen.add(video.videoId);
    return true;
  });
}

/** Основной путь: тот же запрос, который делает сайт YouTube. */
async function searchViaJson(query) {
  const { key, version } = await loadClient();
  const response = await fetch(
    `https://www.youtube.com/youtubei/v1/search?key=${key}&prettyPrint=false`,
    {
      method: "POST",
      headers: {
        "User-Agent": UA,
        "Content-Type": "application/json",
        "Accept-Language": "ru-RU,ru;q=0.9",
      },
      body: JSON.stringify({
        context: {
          client: { clientName: "WEB", clientVersion: version, hl: "ru", gl: "RU" },
        },
        query,
      }),
    }
  );

  if (!response.ok) {
    const error = new Error(`youtubei ответил ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  const out = [];
  collectVideos(data, out);
  return unique(out);
}

/** Запасной путь: обычная страница поиска. */
async function searchViaPage(query) {
  const response = await fetch(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=ru`,
    {
      redirect: "manual",
      headers: {
        "User-Agent": UA,
        "Accept-Language": "ru-RU,ru;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    }
  );

  if (response.status === 0 || response.status >= 300) {
    const error = new Error(`страница поиска ответила ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const html = await response.text();
  const data = extractInitialData(html);
  if (!data) {
    const error = new Error("в странице нет ytInitialData");
    error.status = 0;
    throw error;
  }

  const out = [];
  collectVideos(data, out);
  return unique(out);
}

/**
 * Поиск. Сначала внутренний JSON, при сетевых сбоях — повторы,
 * в крайнем случае обычная страница.
 */
export async function searchYouTube(query, { retries = 2 } = {}) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await searchViaJson(query);
    } catch (error) {
      lastError = error;
      /* 400/403 — скорее всего протух ключ клиента: сбрасываем и берём новый. */
      if (error.status === 400 || error.status === 403) client = null;
      await sleep(700 * (attempt + 1));
    }
  }

  try {
    return await searchViaPage(query);
  } catch (error) {
    throw lastError || error;
  }
}

/** Существует ли ролик и разрешено ли встраивание. Без ключа и без квоты. */
export async function oembed(videoId, { retries = 1 } = {}) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${videoId}`
  )}&format=json`;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": UA } });
      if (!response.ok) {
        /* 401/404 — ролик закрыт или удалён: это ответ, а не сбой сети. */
        if (response.status === 401 || response.status === 403 || response.status === 404) return null;
        if (attempt === retries) return null;
        await sleep(700);
        continue;
      }
      return await response.json();
    } catch {
      if (attempt === retries) return null;
      await sleep(700);
    }
  }
  return null;
}
