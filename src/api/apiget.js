import axios from "axios";

/**
 * Клиент API apiget.ru (неофициальный API Кинопоиска).
 * Документация: https://apiget.ru/documentation/
 *
 * Особенность API: всегда отвечает HTTP 200, а результат запроса лежит в поле error
 * (0 — успех, остальное — код ошибки). Поэтому методы этого клиента НИКОГДА не
 * отклоняют промис: при любой ошибке возвращается пустой результат, чтобы
 * интерфейс не зависал на скелетонах.
 */

const APIGET_URL = "https://apiget.ru/API/";

/** Лимиты самого API */
export const APIGET_LIMITS = {
  LIST_IDS: 100,
  SEARCH: 100,
  UPDATES: 100,
  TOP: 500,
};

function getKey() {
  return (
    process.env.apigetKey ||
    process.env.APIGET_KEY ||
    process.env.NEXT_PUBLIC_APIGET_KEY ||
    ""
  );
}

export const apigetInstance = axios.create({
  baseURL: APIGET_URL,
  headers: { accept: "application/json" },
});

function buildQuery(method, params = {}) {
  const search = new URLSearchParams();
  search.set("method", method);

  Object.keys(params).forEach((name) => {
    const value = params[name];
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null || item === "") return;
        search.append(name, String(item));
      });
      return;
    }

    search.set(name, String(value));
  });

  const key = getKey();
  if (key) search.set("key", key);

  return search.toString();
}

const EMPTY = { error: 0, message: "Ok", results: [], content: [] };

function normalize(data, method) {
  if (!data || typeof data !== "object" || data.error === undefined) {
    console.warn(`[apiget] ${method}: некорректный ответ API`);
    return { ...EMPTY, error: 20, message: "Некорректный ответ API" };
  }

  if (data.error !== 0) {
    console.warn(
      `[apiget] ${method}: ошибка ${data.error} — ${data.message || ""}`
    );
  }

  return {
    ...data,
    results: Array.isArray(data.results) ? data.results : [],
    content: Array.isArray(data.content) ? data.content : [],
  };
}

async function request(method, params) {
  try {
    const response = await apigetInstance.get(`?${buildQuery(method, params)}`);
    return normalize(response.data, method);
  } catch (error) {
    console.warn(
      `[apiget] ${method}: запрос не выполнен — ${error?.message || error}`
    );
    return { ...EMPTY, error: -1, message: "Запрос не выполнен" };
  }
}

export const apigetApi = {
  /** Полная карточка материала: постеры, рейтинги, жанры, страны, актёры, трейлеры, похожие */
  getInfo(kinopoiskId) {
    return request("get-info", { kinopoisk_id: kinopoiskId });
  },

  /** До 100 материалов за один запрос, возвращает полные объекты (в поле content) */
  list(ids) {
    const list = (Array.isArray(ids) ? ids : [ids]).filter(
      (id) => id !== undefined && id !== null && id !== ""
    );
    if (!list.length) return Promise.resolve({ ...EMPTY });
    return request("list", { ids: list.slice(0, APIGET_LIMITS.LIST_IDS).join(",") });
  },

  /** Поиск: query, genre[], country[], year, type (movie|serial), page, limit */
  search(params) {
    return request("search", params);
  },

  getRandom(params) {
    return request("get-random", params);
  },

  getGenres() {
    return request("get-genres");
  },

  getCountries() {
    return request("get-countries");
  },

  getYears() {
    return request("get-years");
  },

  getCount() {
    return request("get-count");
  },

  /** Недавно обновлённые материалы. Используется как перечисление базы, когда фильтров нет */
  getUpdates(params) {
    return request("get-updates", params);
  },

  getTop250(params) {
    return request("get-top250", params);
  },

  getTop500(params) {
    return request("get-top500", params);
  },

  getStills(kinopoiskId) {
    return request("get-stills", { kinopoisk_id: kinopoiskId });
  },

  getFacts(kinopoiskId, type = "all") {
    return request("get-facts", { kinopoisk_id: kinopoiskId, type });
  },

  getSimilar(kinopoiskId) {
    return request("get-similar", { kinopoisk_id: kinopoiskId });
  },

  getTrailers(kinopoiskId) {
    return request("get-trailers", { kinopoisk_id: kinopoiskId });
  },

  getEpisodes(kinopoiskId, season) {
    return request("get-episodes", { kinopoisk_id: kinopoiskId, season });
  },

  getSoundtracks(kinopoiskId) {
    return request("get-soundtracks", { kinopoisk_id: kinopoiskId });
  },

  getActor(kinopoiskId) {
    return request("get-actor", { kinopoisk_id: kinopoiskId });
  },

  searchActor(query, page = 1) {
    return request("search-actor", { query, page });
  },
};

export default apigetApi;
