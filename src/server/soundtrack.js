import fs from "node:fs";
import path from "node:path";

/**
 * Саундтреки к фильмам.
 *
 * Порядок источников — от точного к приблизительному:
 *   1) Wikidata по кинопоисковому id: свойство «саундтрек-альбом» даёт прямую
 *      связь «фильм → альбом». Данные точные, покрытие около половины фильмов.
 *   2) MusicBrainz по найденному альбому — оттуда берём список треков.
 *   3) Deezer как запасной вариант: поиск по названию со строгими проверками
 *      (год, слово «soundtrack» в названии, минимум треков). Если проверки не
 *      прошли — секцию не показываем вовсе: чужой альбом хуже, чем ничего.
 *
 * Всё кэшируется в файл: каждый фильм ищется один раз.
 */

const CACHE_FILE = path.join(process.cwd(), ".cache", "soundtracks.json");
const UA = "Filmhub/1.0 (https://filmhub.one)";

const HIT_TTL = 30 * 24 * 60 * 60 * 1000; // месяц
const MISS_TTL = 24 * 60 * 60 * 1000; // сутки

let store = null;
let dirty = false;

function load() {
  if (store) return store;
  try {
    store = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
  } catch {
    store = {};
  }
  return store;
}

function save() {
  if (!dirty) return;
  try {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(store));
    dirty = false;
  } catch {
    undefined;
  }
}

async function sparql(query) {
  const url = `https://query.wikidata.org/sparql?${new URLSearchParams({
    query,
    format: "json",
  })}`;
  const response = await fetch(url, {
    headers: { "User-Agent": UA, accept: "application/sparql-results+json" },
  });
  if (!response.ok) throw new Error(`Wikidata ${response.status}`);
  const data = await response.json();
  return data.results?.bindings || [];
}

async function musicbrainz(pathname) {
  const response = await fetch(`https://musicbrainz.org/ws/2/${pathname}`, {
    headers: { "User-Agent": UA, accept: "application/json" },
  });
  if (!response.ok) throw new Error(`MusicBrainz ${response.status}`);
  return response.json();
}

async function itunes(pathname) {
  const response = await fetch(`https://itunes.apple.com/${pathname}`);
  if (!response.ok) throw new Error(`iTunes ${response.status}`);
  return response.json();
}

async function deezer(pathname) {
  const response = await fetch(`https://api.deezer.com/${pathname}`);
  if (!response.ok) throw new Error(`Deezer ${response.status}`);
  return response.json();
}

/** Треклист по идентификатору релиза MusicBrainz */
async function tracksFromMusicBrainz(releaseGroupId) {
  const group = await musicbrainz(`release-group/${releaseGroupId}?inc=releases&fmt=json`);
  const releases = (group?.releases || []).filter((item) => item?.id);
  if (!releases.length) return null;

  // Изданий у альбома бывает несколько (обычное и расширенное). Для страницы
  // фильма полезнее самое полное: там больше музыки из фильма. Если MusicBrainz
  // не сообщил число треков — берём самое раннее издание.
  const trackCount = (release) =>
    (release.media || []).reduce((sum, medium) => sum + (Number(medium["track-count"]) || 0), 0) ||
    Number(release["track-count"]) ||
    0;

  const release = [...releases].sort((a, b) => {
    const diff = trackCount(b) - trackCount(a);
    if (diff) return diff;
    return String(a.date || "9999").localeCompare(String(b.date || "9999"));
  })[0];

  // artist-credits нужен, чтобы показать композитора: без него в секции
  // остаются только названия треков
  const full = await musicbrainz(
    `release/${release.id}?inc=recordings+artist-credits&fmt=json`
  );

  const creditName = (credit) =>
    (credit || [])
      .map((item) => item?.name || item?.artist?.name || "")
      .filter(Boolean)
      .join(", ");

  const artist = creditName(full?.["artist-credit"]) || creditName(release["artist-credit"]);
  const tracks = [];
  (full?.media || []).forEach((medium) => {
    (medium?.tracks || []).forEach((track) => {
      tracks.push({
        number: tracks.length + 1,
        title: track.title || "",
        // у каждого трека может быть свой исполнитель (в сборниках песен так и есть)
        artist: creditName(track["artist-credit"]) || "",
        // MusicBrainz отдаёт миллисекунды (235999): округление вверх давало
        // лишнюю секунду на каждом треке
        length: track.length ? Math.floor(track.length / 1000) : null,
      });
    });
  });
  if (!tracks.length) return null;

  return {
    tracks,
    album: release.title || "",
    artist,
    year: (release.date || "").slice(0, 4) || null,
  };
}

/** Запасной путь: Deezer. Проверки жёсткие — лучше ничего, чем чужой альбом */
async function fromDeezer({ title, originalTitle, year }) {
  const query = `${originalTitle || title} original motion picture soundtrack`;
  const search = await deezer(`search/album?q=${encodeURIComponent(query)}&limit=25`);
  const items = search?.data || [];

  const score = (album) => {
    const name = String(album.title || "").toLowerCase();
    let value = 0;
    if (/soundtrack|original motion picture|original score|music from|ost/.test(name)) value += 30;
    if (originalTitle && name.includes(String(originalTitle).toLowerCase())) value += 25;
    else if (title && name.includes(String(title).toLowerCase())) value += 15;
    if (year && String(album.release_date || "").startsWith(String(year))) value += 20;
    if (Number(album.nb_tracks) >= 5) value += 10;
    return value;
  };

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .replace(/[^a-zа-я0-9]+/gi, " ")
      .trim();

  const filmTitles = [originalTitle, title].map(normalize).filter((value) => value.length > 3);

  const best = items
    .filter((album) => Number(album.nb_tracks) >= 5)
    .filter((album) => {
      const name = String(album.title || "").toLowerCase();
      return /soundtrack|original motion picture|original score|music from|ost/.test(name);
    })
    // название фильма обязано быть в названии альбома: без этого в выдачу
    // попадают чужие сборники «Original Motion Picture Soundtrack»
    .filter((album) => {
      const name = normalize(album.title);
      return filmTitles.some((filmTitle) => name.includes(filmTitle));
    })
    .filter((album) => {
      if (!year) return true;
      const albumYear = String(album.release_date || "").slice(0, 4);
      // без года альбома проверять нечем — отклоняем: иначе совпадают чужие
      // фильмы со похожим названием («Старик» и «Старик с пистолетом»)
      if (!albumYear) return false;
      return Math.abs(Number(albumYear) - Number(year)) <= 1;
    })
    .sort((a, b) => score(b) - score(a))[0];

  if (!best) return null;

  const full = await deezer(`album/${best.id}`);
  const tracks = (full?.tracks?.data || []).map((track, index) => ({
    number: index + 1,
    title: track.title || "",
    artist: track.artist?.name || "",
    length: Number(track.duration) || null,
  }));
  if (tracks.length < 5) return null;

  return {
    album: best.title || "",
    artist: best.artist?.name || "",
    cover: best.cover_xl || best.cover_big || best.cover_medium || null,
    year: (best.release_date || "").slice(0, 4) || null,
    source: "Deezer",
    tracks,
  };
}

/**
 * Третий источник: iTunes. Другой индекс, иногда находит альбомы, которых нет
 * в Deezer. Проверки те же — название фильма и год обязательны.
 */
async function fromItunes({ title, originalTitle, year }) {
  const term = `${originalTitle || title} original motion picture soundtrack`;
  const search = await itunes(`search?term=${encodeURIComponent(term)}&entity=album&limit=25`);
  const items = search?.results || [];

  const normalize = (value) =>
    String(value || "").toLowerCase().replace(/[^a-zа-я0-9]+/gi, " ").trim();
  const filmTitles = [originalTitle, title].map(normalize).filter((value) => value.length > 3);

  const best = items
    .filter((album) => Number(album.trackCount) >= 5)
    .filter((album) => {
      const name = String(album.collectionName || "").toLowerCase();
      return /soundtrack|original motion picture|original score|music from|ost/.test(name);
    })
    .filter((album) => {
      const name = normalize(album.collectionName);
      return filmTitles.some((filmTitle) => name.includes(filmTitle));
    })
    .filter((album) => {
      const albumYear = String(album.releaseDate || "").slice(0, 4);
      if (!albumYear) return false;
      return Math.abs(Number(albumYear) - Number(year)) <= 1;
    })
    .sort((a, b) => Number(b.trackCount) - Number(a.trackCount))[0];

  if (!best) return null;

  const lookup = await itunes(`lookup?id=${best.collectionId}&entity=song&limit=200`);
  const songs = (lookup?.results || []).filter((item) => item.wrapperType === "track");
  const tracks = songs.map((song, index) => ({
    number: Number(song.trackNumber) || index + 1,
    title: song.trackName || "",
    artist: song.artistName || "",
    length: song.trackTimeMillis ? Math.floor(song.trackTimeMillis / 1000) : null,
  }));
  if (tracks.length < 5) return null;

  return {
    album: best.collectionName || "",
    artist: best.artistName || "",
    cover: String(best.artworkUrl100 || "").replace("100x100", "600x600") || null,
    year: String(best.releaseDate || "").slice(0, 4) || null,
    source: "iTunes",
    tracks,
  };
}

/** Основной путь: Wikidata даёт альбом, MusicBrainz — треки */
async function fromWikidata(kpId) {
  const rows = await sparql(`
    SELECT ?albumLabel ?mb WHERE {
      ?film wdt:P2603 "${String(kpId).trim()}".
      ?film wdt:P406 ?album .
      OPTIONAL { ?album wdt:P436 ?mb }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "ru,en". }
    } LIMIT 1
  `);

  const row = rows[0];
  if (!row) return null;

  const mbId = row.mb?.value?.split("/").pop();
  const albumLabel = row.albumLabel?.value || "";
  if (!mbId) return { album: albumLabel, source: "Wikidata", tracks: [] };

  const fromMb = await tracksFromMusicBrainz(mbId);
  if (!fromMb) return { album: albumLabel, source: "Wikidata", tracks: [] };

  return {
    album: fromMb.album || albumLabel,
    artist: fromMb.artist || "",
    year: fromMb.year,
    source: "MusicBrainz",
    tracks: fromMb.tracks,
  };
}

export async function getSoundtrack({ kpId, title, originalTitle, year }) {
  if (!kpId) return null;

  const data = load();
  const cached = data[String(kpId)];
  if (cached) {
    const ttl = cached.value ? HIT_TTL : MISS_TTL;
    if (Date.now() - (cached.at || 0) < ttl) return cached.value;
  }

  let result = null;

  try {
    result = await fromWikidata(kpId);
  } catch (error) {
    console.warn("[soundtrack] Wikidata недоступна:", error?.message);
  }

  if (!result?.tracks?.length) {
    try {
      const fallback = await fromDeezer({ title, originalTitle, year });
      if (fallback?.tracks?.length) result = fallback;
    } catch (error) {
      console.warn("[soundtrack] Deezer недоступен:", error?.message);
    }
  }

  // если Deezer не нашёл — пробуем iTunes: индекс другой, иногда удачнее
  if (!result?.tracks?.length) {
    try {
      const fallback = await fromItunes({ title, originalTitle, year });
      if (fallback?.tracks?.length) result = fallback;
    } catch (error) {
      console.warn("[soundtrack] iTunes недоступен:", error?.message);
    }
  }

  if (result && !result.tracks?.length) result = null;

  data[String(kpId)] = { value: result, at: Date.now() };
  dirty = true;
  save();

  return result;
}
