/**
 * Сопоставление фильмов TMDB с Кинопоиском и постоянный кэш карточек.
 *
 * Схема (всё бесплатно, кроме последнего шага):
 *   1. TMDB /movie|tv/{id}?append_to_response=external_ids -> wikidata_id;
 *   2. Wikidata SPARQL: wikidata_id -> P2603 «Kinopoisk film ID» (батчами по 50);
 *   3. apiget list?ids= -> данные карточки как их ждёт сайт (рейтинг КП, постер,
 *      название, год, жанры, страны). Это единственный платный шаг — 0.01 ₽ за
 *      фильм, и только один раз: результат кладётся в файловый кэш.
 *
 * Поэтому стоимость не растёт с трафиком — только с числом уникальных фильмов.
 */

import fs from "node:fs";
import path from "node:path";
import { details } from "./tmdb.js";
import { apigetApi } from "../api/apiget.js";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_FILE = path.join(CACHE_DIR, "tmdb-kp.json");
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
// неудачные сопоставления перепроверяем чаще: база Кинопоиска и Wikidata пополняются
const NEGATIVE_TTL_MS = 60 * 60 * 1000;
// если apiget недоступен (например, кончился баланс) — не долбим его на каждом запросе
const APIGET_COOLDOWN_MS = 15 * 60 * 1000;
// метку «apiget недоступен» храним на диске: иначе при каждом перезапуске
// дев-сервера мы снова и снова тратили запрос на заведомо пустой баланс
const APIGET_BLOCK_FILE = path.join(process.cwd(), ".cache", "apiget-block.json");

function readApigetBlock() {
  try {
    const data = JSON.parse(fs.readFileSync(APIGET_BLOCK_FILE, "utf8"));
    return Number(data?.until) || 0;
  } catch {
    return 0;
  }
}
const SPARQL_BATCH = 50;
const APIGET_BATCH = 100;

let store = null;
let lastSave = 0;

function saveNow(force = false) {
  const now = Date.now();
  if (!force && now - lastSave < 1000) return;
  lastSave = now;
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(store));
  } catch (error) {
    console.warn("[kpMap] не удалось сохранить кэш:", error?.message);
  }
}

function loadStore() {
  if (store) return store;
  try {
    store = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    store = {};
  }
  return store;
}

function scheduleSave() {
  saveNow(false);
}

export function getRecord(tmdbId) {
  const record = loadStore()[tmdbId];
  if (!record) return null;
  const ttl = record.kinopoiskId ? TTL_MS : NEGATIVE_TTL_MS;
  if (Date.now() - (record.updatedAt || 0) > ttl) return null;
  return record;
}

function putRecord(tmdbId, patch) {
  const data = loadStore();
  data[tmdbId] = { ...(data[tmdbId] || {}), ...patch, updatedAt: Date.now() };
  scheduleSave();
  return data[tmdbId];
}

async function pool(items, limit, worker) {
  const list = [...items];
  const results = [];
  const runners = new Array(Math.min(limit, list.length)).fill(null).map(async () => {
    while (list.length) {
      const item = list.shift();
      try {
        results.push(await worker(item));
      } catch (error) {
        results.push({ error: String(error?.message || error), item });
      }
    }
  });
  await Promise.all(runners);
  return results;
}

/** wikidata_id -> kinopoisk_id, батчами через SPARQL */
async function mapWikidataToKinopoisk(qids) {
  const unique = [...new Set(qids.filter(Boolean))];
  const out = new Map();

  for (let offset = 0; offset < unique.length; offset += SPARQL_BATCH) {
    const batch = unique.slice(offset, offset + SPARQL_BATCH);
    const values = batch.map((qid) => `wd:${qid}`).join(" ");
    const query = `SELECT ?film ?kp WHERE { VALUES ?film { ${values} } ?film wdt:P2603 ?kp. }`;
    const url = `https://query.wikidata.org/sparql?${new URLSearchParams({
      query,
      format: "json",
    }).toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/sparql-results+json",
          "User-Agent": "filmhub-catalog/1.0 (+https://filmhub.lol)",
        },
        cache: "no-store",
      });
      if (!response.ok) continue;
      const data = await response.json();
      (data.results?.bindings || []).forEach((row) => {
        const qid = row.film.value.split("/").pop();
        out.set(qid, row.kp.value);
      });
    } catch (error) {
      console.warn("[kpMap] Wikidata недоступна:", error?.message);
    }
  }

  return out;
}

/**
 * Предохранитель: при ошибке apiget (например, error 18 «Недостаточно средств»)
 * пять минут вообще не обращаемся к нему — иначе каждый запрос страницы заново
 * перепроверяет все несопоставленные фильмы и страница грузится десятки секунд.
 */
let apigetBlockedUntil = readApigetBlock();

function apigetAvailable() {
  return Date.now() >= apigetBlockedUntil;
}

function noteApiget(response) {
  const error = response?.error;
  if (error !== undefined && error !== 0) {
    apigetBlockedUntil = Date.now() + APIGET_COOLDOWN_MS;
    try {
      fs.mkdirSync(path.dirname(APIGET_BLOCK_FILE), { recursive: true });
      fs.writeFileSync(
        APIGET_BLOCK_FILE,
        JSON.stringify({ until: apigetBlockedUntil, error, at: new Date().toISOString() })
      );
    } catch {
      undefined;
    }
    console.warn(
      `[apiget] недоступен (ошибка ${error}) — не обращаемся ${Math.round(
        APIGET_COOLDOWN_MS / 60000
      )} мин`
    );
  }
  return response;
}

/** Данные карточек из apiget (0.01 ₽ за найденный материал, один раз на фильм) */
async function hydrateFromApiget(kinopoiskIds) {
  const records = new Map();
  const ids = [...new Set(kinopoiskIds.filter(Boolean))];
  if (!ids.length || !apigetAvailable()) return records;

  for (let offset = 0; offset < ids.length; offset += APIGET_BATCH) {
    const batch = ids.slice(offset, offset + APIGET_BATCH);
    const response = noteApiget(await apigetApi.list(batch));
    (response.content || []).forEach((item) => {
      records.set(item.kinopoisk_id, item);
    });
  }

  return records;
}

function kpFields(kp) {
  return {
    kpTitle: kp?.title_ru || kp?.title_en || null,
    kpYear: kp?.year ?? null,
    kpType: kp?.type || null,
    kpPosterBig: kp?.poster_big || null,
    kpPosterSmall: kp?.poster_small || null,
    kpRating: kp?.rating?.kinopoisk?.value ?? null,
    kpVotes: kp?.rating?.kinopoisk?.count ?? null,
    kpGenres: kp?.genre || null,
    kpCountries: kp?.country || null,
    hydrated: Boolean(kp),
  };
}

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^0-9a-zа-я]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Сверка названия и года: без неё легко подставить чужой фильм и чужой плеер */
function matchApiget(candidate, items) {
  const targets = new Set(
    [normalize(candidate.tmdbTitle), normalize(candidate.originalTitle)].filter(Boolean)
  );
  if (!targets.size) return null;

  const wantsSerial = candidate.media === "tv";

  for (const item of items) {
    const names = [normalize(item.title_ru), normalize(item.title_en)].filter(Boolean);
    if (!names.some((name) => targets.has(name))) continue;
    if (candidate.tmdbYear && item.year && Math.abs(item.year - candidate.tmdbYear) > 1) continue;
    if (Boolean(item.type === "serial") !== wantsSerial) continue;
    return item;
  }

  return null;
}

/**
 * Фолбэк для фильмов, которых нет в Wikidata: ищем по названию в apiget
 * (0.01 ₽ за найденный материал, результат кэшируется навсегда). Заодно это
 * сразу даёт данные карточки, поэтому повторная гидратация не нужна.
 */
async function findByTitle(candidates) {
  const found = new Map();
  if (!candidates.length || !apigetAvailable()) return found;

  await pool(candidates, 4, async (candidate) => {
    const query = candidate.tmdbTitle || candidate.originalTitle;
    if (!query) return null;
    const response = noteApiget(await apigetApi.search({ query, limit: 30 }));
    const item = matchApiget(candidate, response.results || []);
    if (item) found.set(candidate.tmdbId, item);
    return null;
  });

  return found;
}

/**
 * Превращает элементы TMDB в записи кэша с kinopoisk_id.
 * Возвращает Map: tmdbId -> запись (или null, если сопоставить не удалось).
 */
export async function resolveRecords(media, tmdbItems, { preFilter } = {}) {
  const resolved = new Map();
  const missing = [];
  const rehydrate = [];

  tmdbItems.forEach((item) => {
    const cached = getRecord(item.id);
    if (!cached) {
      missing.push(item);
      return;
    }
    // запись есть, но данные Кинопоиска не догрузились (например, кончился
    // баланс apiget) — пробуем дозаполнить при следующем запросе
    if (cached.kinopoiskId && !cached.hydrated) rehydrate.push(cached);
    resolved.set(item.id, cached);
  });

  if (rehydrate.length) {
    const hydrated = await hydrateFromApiget(rehydrate.map((record) => record.kinopoiskId));
    rehydrate.forEach((record) => {
      const kp = hydrated.get(record.kinopoiskId);
      if (!kp) return;
      resolved.set(record.tmdbId, putRecord(record.tmdbId, kpFields(kp)));
    });
  }

  if (!missing.length) return resolved;

  // 1. детали + wikidata_id
  const detailed = await pool(missing, 8, async (item) => ({
    item,
    data: await details(media, item.id),
  }));

  const withQid = [];
  detailed.forEach(({ item, data }) => {
    if (!data || data.__error__) return;
    const wikidata = data.external_ids?.wikidata_id || null;
    withQid.push({ item, data, wikidata });
  });

  // 2. wikidata -> kinopoisk id
  const kpByQid = await mapWikidataToKinopoisk(withQid.map((entry) => entry.wikidata));

  const needHydrate = [];
  const pending = [];

  withQid.forEach(({ item, data, wikidata }) => {
    const kinopoiskId = wikidata ? kpByQid.get(wikidata) || null : null;
    const base = {
      tmdbId: item.id,
      media,
      wikidata,
      kinopoiskId,
      tmdbTitle: data.title || data.name || item.title || item.name || "",
      originalTitle: data.original_title || data.original_name || "",
      tmdbYear: Number(String(data.release_date || data.first_air_date || "").slice(0, 4)) || null,
      tmdbRating: data.vote_average ?? null,
      tmdbVotes: data.vote_count ?? null,
      tmdbPoster: data.poster_path || item.poster_path || null,
      originCountry: data.origin_country || [],
      originalLanguage: data.original_language || item.original_language || null,
      genres: (data.genres || []).map((genre) => genre.name),
    };
    if (preFilter && !preFilter(base)) return; // отсекаем до платных запросов
    pending.push(base);
    if (kinopoiskId) needHydrate.push(kinopoiskId);
  });

  // 3. карточки из apiget по найденным id
  const hydrated = needHydrate.length ? await hydrateFromApiget(needHydrate) : new Map();

  // 4. кого нет в Wikidata (или apiget не ответил) — ищем по названию
  const unresolved = pending.filter((base) => {
    const kp = base.kinopoiskId ? hydrated.get(base.kinopoiskId) : null;
    return !kp;
  });
  const foundByTitle = unresolved.length ? await findByTitle(unresolved) : new Map();

  pending.forEach((base) => {
    const kp =
      (base.kinopoiskId && hydrated.get(base.kinopoiskId)) ||
      foundByTitle.get(base.tmdbId) ||
      null;
    const record = putRecord(base.tmdbId, {
      ...base,
      kinopoiskId: kp?.kinopoisk_id ?? base.kinopoiskId ?? null,
      ...kpFields(kp),
    });
    resolved.set(base.tmdbId, record);
  });

  saveNow(true);

  // фильмы, по которым TMDB не отдал детали, не кэшируем
  return resolved;
}

export function cacheStats() {
  const data = loadStore();
  const values = Object.values(data);
  return {
    total: values.length,
    mapped: values.filter((item) => item.kinopoiskId).length,
    hydrated: values.filter((item) => item.hydrated).length,
  };
}
