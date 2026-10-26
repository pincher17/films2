import { ensureCacheVersion } from "./cacheVersion.js";
import { prisma } from "./prisma.js";
import { manualKinopoiskByTmdb, manualTmdbByKinopoisk } from "./manualMap.js";
ensureCacheVersion();
/**
 * Данные страницы фильма из TMDB.
 *
 * На сайте id фильма — кинопоисковский (он же в маршруте /film/{id} и в плеерах),
 * а TMDB такого id не знает. Поэтому сначала бесплатно восстанавливаем связку
 * через Wikidata: P2603 (Kinopoisk film ID) -> P4947 (TMDb movie ID) /
 * P4983 (TMDb TV series ID). Обратная связка (TMDB id -> kinopoisk id) нужна для
 * карточек «Похожие» и «Сиквелы и приквелы», и делается тем же способом одним
 * батч-запросом. Всё кэшируется в .cache/kp-tmdb.json.
 */

import fs from "node:fs";
import path from "node:path";
import { tmdbGet, posterUrl } from "./tmdb.js";

const CACHE_FILE = path.join(process.cwd(), ".cache", "kp-tmdb.json");
let store = null;
let countriesMap = null;

function loadStore() {
  if (store) return store;
  try {
    store = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    store = { toTmdb: {}, toKp: {} };
  }
  if (!store.toTmdb) store.toTmdb = {};
  if (!store.toKp) store.toKp = {};
  return store;
}

function saveStore() {
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(store));
  } catch (error) {
    console.warn("[filmPage] кэш не сохранён:", error?.message);
  }
}

async function sparql(query) {
  try {
    const response = await fetch(
      `https://query.wikidata.org/sparql?${new URLSearchParams({ query, format: "json" }).toString()}`,
      {
        headers: {
          accept: "application/sparql-results+json",
          "User-Agent": "filmhub-film-page/1.0 (+https://filmhub.one)",
        },
        cache: "no-store",
      }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.results?.bindings || [];
  } catch (error) {
    console.warn("[filmPage] Wikidata недоступна:", error?.message);
    return [];
  }
}

/** kinopoisk_id -> { tmdbId, media } */
/**
 * Выбор лучшего трейлера. Берём не первый попавшийся, а официальный трейлер,
 * желательно на русском: возрастные ролики и фанатские нарезки YouTube либо
 * не встраивает вовсе, либо показывает проверку «подтвердите, что вы не бот».
 */
function pickTrailer(videos = []) {
  const candidates = (videos || []).filter((video) => video?.site === "YouTube" && video?.key);
  if (!candidates.length) return null;

  const score = (video) => {
    let value = 0;
    if (video.type === "Trailer") value += 40;
    else if (video.type === "Teaser") value += 15;
    if (video.official) value += 20;
    if (video.iso_639_1 === "ru") value += 25;
    else if (video.iso_639_1 === "en") value += 10;
    if (Number(video.size) >= 1080) value += 5;
    return value;
  };

  return [...candidates].sort(
    (a, b) =>
      score(b) - score(a) ||
      String(b.published_at || "").localeCompare(String(a.published_at || ""))
  )[0];
}


/**
 * Резервный поиск в TMDB по названию.
 *
 * Нужен, когда точного соответствия Кинопоиск→TMDB нет: TMDB кинопоисковых id
 * не знает вообще (проверено — /find с kinopoisk_id всегда пустой), поэтому
 * единственный оставшийся путь — искать по названию и проверять результат.
 */
async function searchTmdbByTitle(title, year) {
  const clean = String(title || "").trim();
  if (!clean) return null;

  const candidates = [];
  for (const media of ["movie", "tv"]) {
    try {
      const query = new URLSearchParams({ query: clean, language: "ru-RU" });
      if (year) query.set(media === "movie" ? "year" : "first_air_date_year", String(year));
      const found = await tmdbGet(`/search/${media}?${query.toString()}`);
      for (const item of found?.results?.slice(0, 5) || []) {
        candidates.push({ media, item });
      }
    } catch {
      undefined;
    }
  }
  if (!candidates.length) return null;

  // похожесть названия: сравниваем без регистра, пробелов и знаков
  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "");

  const wanted = normalize(clean);
  const score = ({ item }) => {
    const names = [item.title, item.name, item.original_title, item.original_name]
      .map(normalize)
      .filter(Boolean);
    if (names.includes(wanted)) return 2;
    if (names.some((name) => name.startsWith(wanted) || wanted.startsWith(name))) return 1;
    return 0;
  };

  const best = candidates
    .map((candidate) => ({ ...candidate, score: score(candidate) }))
    .sort((a, b) => b.score - a.score)[0];

  // принимаем только уверенное совпадение, иначе лучше ничего, чем чужой фильм
  if (!best || best.score < 1) return null;
  return { tmdbId: best.item.id, media: best.media };
}

export async function resolveTmdbByKinopoisk(kinopoiskId) {
  const key = String(kinopoiskId ?? "").trim();
  if (!key) return null;

  // свой список важнее всего: он закрывает пробелы Wikidata
  const manual = manualTmdbByKinopoisk(key);
  if (manual) return manual;

  const data = loadStore();
  if (data.toTmdb[key] !== undefined) return data.toTmdb[key];

  const rows = await sparql(
    `SELECT ?f ?m ?tv WHERE { ?f wdt:P2603 "${key}". OPTIONAL { ?f wdt:P4947 ?m } OPTIONAL { ?f wdt:P4983 ?tv } }`
  );

  const row = rows[0];
  const movieId = row?.m?.value;
  const tvId = row?.tv?.value;
  const result =
    movieId || tvId
      ? {
          tmdbId: Number(movieId || tvId),
          media: movieId ? "movie" : "tv",
          wikidata: row.f.value.split("/").pop(),
        }
      : null;

  /*
   * Резервный путь: точного соответствия нет — пробуем найти по названию.
   * Название берём из Wikidata (там точно есть элемент с этим кинопоисковым id,
   * раз мы его нашли), затем ищем в TMDB и проверяем похожесть.
   */
  let fallback = null;
  if (!result) {
    try {
      const labels = await sparql(
        `SELECT ?label ?year WHERE { ?f wdt:P2603 "${key}". OPTIONAL { ?f rdfs:label ?label FILTER(lang(?label) = "ru") } OPTIONAL { ?f wdt:P577 ?year } } LIMIT 3`
      );
      const label = labels.find((row) => row?.label?.value)?.label?.value;
      const year = Number(String(labels.find((row) => row?.year?.value)?.year?.value || "").slice(0, 4)) || null;
      if (label) {
        fallback = await searchTmdbByTitle(label, year);
        if (fallback) {
          console.info("[tmdb] найдено по названию:", key, label, "→", fallback.tmdbId, fallback.media);
        }
      }
    } catch (error) {
      console.warn("[tmdb] резервный поиск не удался", key, error?.message);
    }
  }

  /*
   * Кэшируем ТОЛЬКО успешное соответствие. Раньше сюда попадал и null: если
   * Wikidata в тот момент не ответила, фильм «залипал» как ненайденный
   * навсегда и больше не появлялся в «Продолжить просмотр».
   */
  const final = result || fallback;
  if (final) {
    data.toTmdb[key] = final;
    saveStore();
  }
  return final;
}

/** Список TMDB id -> kinopoisk_id (для «Похожих» и «Сиквелов») */
export async function resolveKinopoiskByTmdbIds(ids, media) {
  const wanted = [...new Set((ids || []).filter(Boolean).map(String))];
  if (!wanted.length) return new Map();

  const data = loadStore();
  const result = new Map();
  let missing = [];

  wanted.forEach((id) => {
    // сначала свой список: он закрывает то, чего нет в Wikidata
    const manual = manualKinopoiskByTmdb(id, media);
    if (manual) {
      result.set(Number(id), manual);
      return;
    }

    /* Кэш разделяем по типу: у TMDB разные нумерации для фильмов и сериалов,
       и общий ключ давал коллизии — сериал «Во все тяжкие» (1396) получал
       кинопоисковый id фильма «Зеркало» (тоже 1396). */
    const cacheKey = `${media || "movie"}:${id}`;
    const cached = data.toKp[cacheKey];
    if (cached !== undefined) {
      if (cached) result.set(Number(id), cached);
    } else {
      missing.push(id);
    }
  });

  /* Сначала смотрим свою таблицу соответствий — её наполняет скрипт kpmap
     через платную API Кинопоиска. Она точнее Wikidata и покрывает зарубежные
     сериалы, которых там нет. */
  if (wanted.length) {
    try {
      const rows = await prisma.kpMap.findMany({
        where: {
          media: media || "movie",
          tmdbId: { in: wanted.map((id) => Number(id)).filter(Number.isFinite) },
        },
      });
      rows.forEach((row) => {
        result.set(row.tmdbId, row.kpId);
        data.toKp[`${media || "movie"}:${row.tmdbId}`] = row.kpId;
      });
      missing = missing.filter((id) => !result.has(Number(id)));
    } catch {
      undefined;
    }
  }

  if (missing.length) {
    const property = media === "tv" ? "P4983" : "P4947";
    const rows = await sparql(
      `SELECT ?t ?kp WHERE { VALUES ?t { ${missing.map((id) => `"${id}"`).join(" ")} } ?f wdt:${property} ?t. ?f wdt:P2603 ?kp. }`
    );

    const found = new Map();
    rows.forEach((row) => {
      found.set(row.t.value, Number(row.kp.value));
    });

    missing.forEach((id) => {
      const kp = found.get(id) ?? null;
      data.toKp[`${media || "movie"}:${id}`] = kp;
      if (kp) result.set(Number(id), kp);
    });
    saveStore();
  }

  return result;
}

/** Локализованные названия стран (TMDB отдаёт их по-русски при language=ru-RU) */
async function getCountries() {
  if (countriesMap) return countriesMap;
  const data = await tmdbGet("/configuration/countries");
  const map = new Map();
  (Array.isArray(data) ? data : []).forEach((country) => {
    map.set(country.iso_3166_1, country.native_name || country.english_name);
  });
  countriesMap = map;
  return map;
}

const CARTOON_GENRES = ["мультфильм", "анимац", "animation"];

/**
 * TMDB отдаёт ключевые слова только по-английски, поэтому частые переводим сами.
 * Незнакомые показываем как есть — словарь легко дополнять.
 */
const KEYWORD_RU = {
  "artificial intelligence": "искусственный интеллект",
  "space": "космос",
  "survival": "выживание",
  "based on novel": "по книге",
  "dystopia": "антиутопия",
  "post-apocalyptic": "постапокалипсис",
  "future": "будущее",
  "robot": "робот",
  "alien": "пришелец",
  "friendship": "дружба",
  "revenge": "месть",
  "murder": "убийство",
  "police": "полиция",
  "detective": "детектив",
  "family": "семья",
  "school": "школа",
  "world war ii": "Вторая мировая",
  "superhero": "супергерой",
  "time travel": "путешествие во времени",
  "magic": "магия",
  "dragon": "дракон",
  "zombie": "зомби",
  "vampire": "вампир",
  "ghost": "призрак",
  "serial killer": "серийный убийца",
  "heist": "ограбление",
  "spy": "шпион",
  "martial arts": "боевые искусства",
  "sport": "спорт",
  "music": "музыка",
  "biography": "биография",
  "based on true story": "по реальным событиям",
  "coming of age": "взросление",
  "small town": "маленький город",
  "monster": "монстр",
  "kidnapping": "похищение",
  "prison": "тюрьма",
  "virtual reality": "виртуальная реальность",
  "cyberpunk": "киберпанк",
  "apocalypse": "апокалипсис",
  "desert": "пустыня",
  "ocean": "океан",
  "island": "остров",
  "snow": "снег",
  "christmas": "Рождество",
  "new york city": "Нью-Йорк",
  "los angeles": "Лос-Анджелес",
  "sequel": "сиквел",
  "family relationships": "семейные отношения",
  "love": "любовь",
  "man vs machine": "человек против машины",
  "saving the world": "спасение мира",
  "prophecy": "пророчество",
  "philosophy": "философия",
  "allegory": "аллегория",
  "chosen one": "избранный",
  "simulated reality": "смоделированная реальность",
  "fortune teller": "гадалка",
  "insurgence": "восстание",
  "hacker": "хакер",
  "computer virus": "компьютерный вирус",
  "dreams": "сны",
  "memory": "память",
  "identity": "идентичность",
  "war": "война",
  "guns": "оружие",
  "escape": "побег",
  "rescue": "спасение",
  "sacrifice": "жертва",
  "betrayal": "предательство",
  "brotherhood": "братство",
  "competition": "соперничество",
  "teenager": "подростки",
  "college": "колледж",
  "holiday": "отпуск",
  "wedding": "свадьба",
  "supernatural": "сверхъестественное",
  "curse": "проклятие",
  "demon": "демон",
  "witch": "ведьма",
  "king": "король",
  "queen": "королева",
  "princess": "принцесса",
  "treasure": "сокровище",
  "pirates": "пираты",
  "cowboy": "ковбой",
  "space travel": "космический полёт",
  "spaceship": "космический корабль",
  "planet": "планета",
  "astronaut": "космонавт",
  "nasa": "NASA",
  "science": "наука",
  "experiment": "эксперимент",
  "scientist": "учёный",
  "biotechnology": "биотехнологии",
  "based on novel or book": "по книге",
  "kingdom": "королевство",
  "intrigue": "интриги",
  "fantasy world": "фэнтезийный мир",
  "epic": "эпос",
  "politics": "политика",
  "power": "власть",
  "conspiracy": "заговор",
  "assassin": "убийца",
  "mafia": "мафия",
  "gangster": "гангстер",
  "hitman": "наёмный убийца",
  "cult": "культ",
  "possession": "одержимость",
  "haunted house": "дом с призраками",
  "werewolf": "оборотень",
  "mermaid": "русалка",
  "giant": "гигант",
  "dinosaur": "динозавр",
  "shark": "акула",
  "dog": "собака",
  "cat": "кошка",
  "horse": "лошадь",
  "medieval": "средневековье",
  "sword and sorcery": "меч и магия",
  "father son relationship": "отцы и дети",
  "mother daughter relationship": "матери и дочери",
  "loss of loved one": "потеря близкого",
  "grief": "горе",
  "redemption": "искупление",
  "guilt": "вина",
  "obsession": "одержимость",
  "mental illness": "психическое расстройство",
  "addiction": "зависимость",
  "poverty": "бедность",
  "racism": "расизм",
  "slavery": "рабство",
  "immigration": "иммиграция",
  "dancing": "танцы",
  "singing": "пение",
  "boxing": "бокс",
  "football": "футбол",
  "basketball": "баскетбол",
  "hockey": "хоккей",
  "chess": "шахматы",
  "cooking": "кулинария",
  "fashion": "мода",
  "journalism": "журналистика",
  "lawyer": "юрист",
  "doctor": "врач",
  "teacher": "учитель",
  "soldier": "солдат",
  "pirate": "пират",
  "ninja": "ниндзя",
  "samurai": "самурай",
  "viking": "викинг",
  "ancient rome": "Древний Рим",
  "ancient greece": "Древняя Греция",
  "egypt": "Египет",
  "world war i": "Первая мировая",
  "vietnam war": "война во Вьетнаме",
  "cold war": "холодная война",
  "terrorism": "терроризм",
  "hostage": "заложники",
  "natural disaster": "стихийное бедствие",
  "volcano": "вулкан",
  "earthquake": "землетрясение",
  "tsunami": "цунами",
  "pandemic": "пандемия",
  "virus": "вирус",
  "zombie apocalypse": "зомби-апокалипсис",
  "time loop": "временная петля",
  "parallel world": "параллельный мир",
  "superpower": "суперспособности",
  "android": "андроид",
  "cyborg": "киборг",
  "hologram": "голограмма",
  "teleportation": "телепортация",
  "immortality": "бессмертие",
  "afterlife": "загробная жизнь",
  "heaven": "рай",
  "hell": "ад",
  "angel": "ангел",
  "devil": "дьявол",
  "god": "бог",
  "religion": "религия",
  "christianity": "христианство",
  "magic realism": "магический реализм",
};

/** «Artificial Intelligence (A.I.)» -> «artificial intelligence» */
function translateKeyword(name) {
  const cleaned = String(name || "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^0-9a-zа-я\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;
  // теги без перевода не показываем — иначе на странице смесь языков
  return KEYWORD_RU[cleaned] || null;
}

function isCartoon(genres) {
  return (genres || []).some((genre) =>
    CARTOON_GENRES.some((marker) => String(genre).toLowerCase().includes(marker))
  );
}

function toCard(item, kinopoiskId) {
  const poster = posterUrl(item.poster_path, "w500");
  return {
    id: kinopoiskId,
    name: item.title || item.name || "",
    alternativeName: item.original_title || item.original_name || "",
    enName: item.original_title || item.original_name || null,
    year: Number(String(item.release_date || item.first_air_date || "").slice(0, 4)) || null,
    type: item.__media === "tv" ? "tv-series" : "movie",
    description: "",
    shortDescription: null,
    movieLength: null,
    rating: { kp: item.vote_average || 0, imdb: 0, filmCritics: 0, russianFilmCritics: 0, await: 0 },
    votes: { kp: item.vote_count || 0, imdb: 0, filmCritics: 0, russianFilmCritics: 0, await: 0 },
    poster: { url: poster, previewUrl: poster },
    logo: { url: null },
    externalId: { imdb: null },
    names: [],
  };
}

async function buildRelated(items, media) {
  const list = (items || []).slice(0, 20);
  const map = await resolveKinopoiskByTmdbIds(list.map((item) => item.id), media);

  return list
    .filter((item) => map.has(item.id))
    .map((item) => toCard({ ...item, __media: media }, map.get(item.id)));
}

/**
 * Полная карточка фильма в формате, который ждёт фронтенд Filmhub
 * (тот же FilmInfoType, что отдавал apiget).
 */

/**
 * Трейлер для страницы фильма: сначала TMDB, если там пусто — наша база.
 * Наполнением базы занимается скрипт scripts/trailers.mjs.
 */
async function buildVideosBlock(trailer, kinopoiskId, tmdbId, media) {
  if (trailer?.key) {
    return {
      trailers: [
        {
          // youtube-nocookie мягче к встраиванию, autoplay убран: именно он
          // чаще всего провоцирует проверку «подтвердите, что вы не бот»
          url: `https://www.youtube-nocookie.com/embed/${trailer.key}?rel=0&modestbranding=1&playsinline=1`,
          watchUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
          name: trailer.name || "",
          site: "YouTube",
        },
      ],
      teasers: [],
    };
  }

  try {
    /* В базе трейлеры сохранены по TMDB id (так их нашёл скрипт), а страница
       знает ещё и кинопоисковый — поэтому ищем по обоим. */
    const keys = [Number(kinopoiskId), Number(tmdbId)].filter((id) => Number.isFinite(id) && id > 0);
    /* Тип обязателен: у TMDB разные нумерации, и без него фильм мог получить
       трейлер сериала с тем же номером. */
    const saved = keys.length
      ? await prisma.trailer.findFirst({
          where: { filmId: { in: keys }, OR: [{ media: media || "movie" }, { media: null }] },
          orderBy: { createdAt: "desc" },
        })
      : null;
    if (saved?.youtubeId) {
      return {
        trailers: [
          {
            url: `https://www.youtube-nocookie.com/embed/${saved.youtubeId}?rel=0&modestbranding=1&playsinline=1`,
            watchUrl: `https://www.youtube.com/watch?v=${saved.youtubeId}`,
            name: saved.title || "",
            site: "YouTube",
          },
        ],
        teasers: [],
      };
    }
  } catch {
    undefined;
  }

  return { trailers: [], teasers: [] };
}

export async function getFilmPageData(kinopoiskId) {
  const resolved = await resolveTmdbByKinopoisk(kinopoiskId);
  if (!resolved?.tmdbId) return null;

  const media = resolved.media;
  const data = await tmdbGet(`/${media}/${resolved.tmdbId}`, {
    append_to_response:
      "credits,videos,images,recommendations,similar,keywords,external_ids",
  });

  if (!data || data.__error__ || (!data.title && !data.name)) return null;

  const countries = await getCountries();
  const genres = (data.genres || []).map((genre) => genre.name);
  const cartoon = isCartoon(genres);
  const trailer = pickTrailer(data.videos?.results);

  const backdrop = posterUrl(data.backdrop_path, "w1280");
  const posterBig = posterUrl(data.poster_path, "original");
  const posterSmall = posterUrl(data.poster_path, "w500");

  const collection = data.belongs_to_collection;
  let sequels = [];
  if (collection?.id) {
    const parts = await tmdbGet(`/collection/${collection.id}`);
    sequels = await buildRelated(
      (parts.parts || []).filter((part) => part.id !== data.id),
      media
    );
  }

  const similar = await buildRelated(
    [...(data.recommendations?.results || []), ...(data.similar?.results || [])],
    media
  );

  // убираем дубли между «похожими» и «сиквелами»
  const sequelIds = new Set(sequels.map((card) => card.id));
  const similarClean = similar.filter(
    (card, index) =>
      !sequelIds.has(card.id) && similar.findIndex((item) => item.id === card.id) === index
  );

  return {
    id: Number(kinopoiskId),
    name: data.title || data.name || "",
    alternativeName: data.original_title || data.original_name || "",
    enName: data.original_title || data.original_name || null,
    year: Number(String(data.release_date || data.first_air_date || "").slice(0, 4)) || null,
    type: media === "tv" ? (cartoon ? "animated-series" : "tv-series") : cartoon ? "cartoon" : "movie",
    description: data.overview || "",
    shortDescription: data.tagline || null,
    slogan: data.tagline || null,
    movieLength: data.runtime || (data.episode_run_time || [])[0] || null,
    ageRating: null,
    poster: { url: posterBig, previewUrl: posterSmall },
    backdrop: { url: backdrop },
    rating: {
      kp: data.vote_average || 0,
      imdb: 0,
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    votes: {
      kp: data.vote_count || 0,
      imdb: 0,
      filmCritics: 0,
      russianFilmCritics: 0,
      await: 0,
    },
    genres: genres.map((name) => ({ name })),
    countries: (data.production_countries || []).map((country) => ({
      name: countries.get(country.iso_3166_1) || country.name,
    })),
    productionCompanies: (data.production_companies || [])
      .map((company) => company?.name)
      .filter(Boolean)
      .slice(0, 4),
    spokenLanguages: (data.spoken_languages || [])
      .map((language) => language?.name || language?.english_name)
      .filter(Boolean),
    status: data.status || null,
    homepage: data.homepage || null,
    facts: [],
    // у фильмов ключевые слова в keywords.keywords, у сериалов — в keywords.results
    keywords: (
      data.keywords?.keywords ||
      data.keywords?.results ||
      []
    )
      .map((keyword) => translateKeyword(keyword?.name))
      .filter(Boolean)
      .slice(0, 12),
    // apiget отдаёт факты и ляпы, у TMDB их нет — оставляем пустыми
    videos: await buildVideosBlock(trailer, kinopoiskId, data.id, data.__media),
    persons: [
      ...(data.credits?.cast || []).slice(0, 30).map((person) => ({
        id: person.id,
        name: person.name,
        enName: person.original_name || "",
        description: person.character || null,
        enProfession: "actor",
        profession: "Актер",
        photo: posterUrl(person.profile_path, "w185"),
      })),
      ...(data.credits?.crew || [])
        .filter((person) => ["Director", "Writer", "Producer"].includes(person.job))
        .map((person) => ({
          id: person.id,
          name: person.name,
          enName: person.original_name || "",
          description: null,
          enProfession: person.job.toLowerCase(),
          profession: person.job,
          photo: posterUrl(person.profile_path, "w185"),
        })),
    ],
    images: {
      postersCount: (data.images?.posters || []).length,
      backdropsCount: (data.images?.backdrops || []).length,
      framesCount: (data.images?.backdrops || []).length,
    },
    stills: (data.images?.backdrops || []).map((image) => posterUrl(image.file_path, "w780")),
    similarMovies: similarClean,
    sequelsAndPrequels: sequels,
    budget: { value: data.budget || null, currency: "$" },
    fees: {
      world: { value: data.revenue || null, currency: "$" },
      russia: { value: null, currency: "$" },
      usa: { value: null, currency: "$" },
    },
    externalId: { imdb: data.imdb_id || null },
    tmdbId: resolved.tmdbId,
    source: "tmdb",
  };
}
