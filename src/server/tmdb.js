/**
 * Серверный клиент TMDB (The Movie Database).
 *
 * Ключ читается только на сервере: TMDB_KEY в .env.local. Поддерживаются оба
 * варианта ключа — v3 API Key (32 символа) и v4 Read Access Token (JWT).
 *
 * Модуль используется только внутри route handler'ов Next.js.
 */

const TMDB_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE = "https://image.tmdb.org/t/p";

function getToken() {
  return process.env.TMDB_KEY || process.env.tmdbKey || "";
}

function authHeaders() {
  const token = getToken();
  if (!token) return {};
  // v4 Read Access Token — это JWT, он передаётся в заголовке
  return token.includes(".") ? { Authorization: `Bearer ${token}` } : {};
}

function withKey(params) {
  const token = getToken();
  if (!token) return params;
  if (token.includes(".")) return params;
  return { ...params, api_key: token };
}

/**
 * @param {object} params
 * @param {number} revalidate  сколько секунд Next держит ответ TMDB в своём
 *   кэше данных: страницы выдачи и карточки меняются медленно, а запросов много
 */
export async function tmdbGet(path, params = {}, revalidate = 3600) {
  const token = getToken();
  if (!token) return { __error__: "TMDB_KEY не задан" };

  const query = new URLSearchParams(
    Object.entries(withKey({ language: "ru-RU", ...params }))
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, String(value)])
  );

  const url = `${TMDB_URL}${path}?${query.toString()}`;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json", ...authHeaders() },
        next: { revalidate },
      });
      if (response.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        continue;
      }
      if (!response.ok) {
        return { __error__: `TMDB ${response.status}` };
      }
      return await response.json();
    } catch (error) {
      if (attempt === 2) return { __error__: String(error?.message || error) };
      await new Promise((resolve) => setTimeout(resolve, 800));
    }
  }

  return { __error__: "TMDB недоступен" };
}

/** URL постера по poster_path */
export function posterUrl(path, size = "w500") {
  return path ? `${TMDB_IMAGE}/${size}${path}` : null;
}

// ---------------------------------------------------------------- справочники

const cache = {
  movieGenres: null,
  tvGenres: null,
  keywords: new Map(),
  companies: new Map(),
};

/** Жанры TMDB с русскими названиями: имя -> id */
export async function getGenres(media = "movie") {
  const key = media === "tv" ? "tvGenres" : "movieGenres";
  if (cache[key]) return cache[key];

  const data = await tmdbGet(`/genre/${media}/list`);
  const map = new Map();
  (data.genres || []).forEach((genre) => {
    map.set(String(genre.name).toLowerCase(), genre.id);
  });
  cache[key] = map;
  return map;
}

/**
 * У сериалов в TMDB другая система жанров: «триллера», «ужасов», «фантастики»
 * там нет, но есть «детектив», «криминал», «нф и фэнтези». Без сопоставления
 * такие фильтры либо не работали, либо обнуляли выдачу.
 */
const TV_GENRE_FALLBACKS = {
  триллер: ["детектив"],
  ужасы: ["детектив"],
  фантастика: ["нф и фэнтези"],
  фэнтези: ["нф и фэнтези"],
  боевик: ["боевик и приключения"],
  приключения: ["боевик и приключения"],
  история: ["война и политика"],
  музыка: ["документальный"],
  "короткометражка": ["драма"],
};

/** Жанр сайта -> id жанра TMDB (или null) */
export async function resolveGenre(name, media) {
  const map = await getGenres(media);
  const key = String(name || "").toLowerCase().trim();
  if (map.has(key)) return { kind: "genre", id: map.get(key) };

  /* Для сериалов подбираем ближайший существующий жанр: иначе, например,
     «триллер» превращался в случайное ключевое слово и выдавал пустоту. */
  if (media === "tv") {
    for (const alias of TV_GENRE_FALLBACKS[key] || []) {
      if (map.has(alias)) return { kind: "genre", id: map.get(alias) };
    }
  }

  return null;
}

/** Русские названия жанров, которых нет в TMDB, ищем как ключевые слова */
export const KEYWORD_ALIASES = {
  биография: "biography",
  мюзикл: "musical",
  спорт: "sport",
  детский: "kids",
  короткометражка: "short film",
};

export async function resolveKeywordId(name) {
  const query = KEYWORD_ALIASES[String(name || "").toLowerCase()] || name;
  if (cache.keywords.has(query)) return cache.keywords.get(query);

  const data = await tmdbGet("/search/keyword", { query });
  const id = data.results?.[0]?.id ?? null;
  cache.keywords.set(query, id);
  return id;
}

/**
 * Карта платформ: id сетей и компаний TMDB.
 *
 * Это внутренние номера TMDB (не кинопоисковские!): network 213 = Netflix,
 * 49 = HBO, 2552 = Apple TV+, 1024 = Amazon. Нужны как параметры фильтра:
 * with_networks=213 → «всё, что вышло на Netflix».
 *
 * Поиск компании по названию здесь не годится: TMDB отдаёт случайную
 * компанию-однофамильца (для «Netflix» — фирму с 15 фильмами).
 */
export const PLATFORM_IDS = {
  netflix: { network: 213, company: 213 },
  hbo: { network: 49, company: 3268 },
  "apple tv+": { network: 2552, company: 194232 },
  "amazon prime video": { network: 1024, company: 210099 },
  hulu: { network: 453, company: null },
  "disney+": { network: 2739, company: 2 },
  "paramount+": { network: 4330, company: 4 },
  max: { network: 3186, company: 174 },
  peacock: { network: 3353, company: null },
  "dc universe": { network: null, company: 184898 },
  kion: { network: null, company: 294156 },
  okko: { network: null, company: 175169 },
};

/** id платформы по названию студии с сайта */
export function platformIds(name) {
  const key = String(name || "").trim().toLowerCase();
  return PLATFORM_IDS[key] || null;
}

/** Компания-студия по имени — запасной вариант, если платформы нет в карте */
export async function resolveCompanyId(name) {
  if (cache.companies.has(name)) return cache.companies.get(name);

  const data = await tmdbGet("/search/company", { query: name });
  const id = data.results?.[0]?.id ?? null;
  cache.companies.set(name, id);
  return id;
}

// ------------------------------------------------------------------- запросы

export function discoverPath(media) {
  return media === "tv" ? "/discover/tv" : "/discover/movie";
}

/** Один запрос discover */
export async function discover(media, params) {
  const data = await tmdbGet(discoverPath(media), params);
  if (data.__error__) return { error: data.__error__, results: [], totalPages: 0, totalResults: 0 };

  return {
    results: data.results || [],
    page: data.page || 1,
    totalPages: data.total_pages || 0,
    totalResults: data.total_results || 0,
  };
}

/** Карточка материала вместе с external_ids (нужен wikidata_id) */
export async function details(media, id) {
  return tmdbGet(`/${media === "tv" ? "tv" : "movie"}/${id}`, {
    append_to_response: "external_ids",
  });
}
