import fs from "fs";
import path from "path";

/**
 * Соответствия Кинопоиск ↔ TMDB, заданные вручную.
 *
 * Нужны для фильмов, которых нет в Wikidata: там кинопоисковые id проставляют
 * волонтёры, и до новых или малоизвестных сериалов руки не доходят. Без такого
 * id фильм не показывается в поиске и не играет (плееры работают по Кинопоиску).
 *
 * Чтобы добавить фильм: найдите его на Кинопоиске, возьмите число из адреса
 * (kinopoisk.ru/series/5319979 → 5319979) и допишите пару в kpManualMap.json.
 */

let entries = [];
let loaded = false;

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const file = path.join(process.cwd(), "src", "data", "kpManualMap.json");
    entries = JSON.parse(fs.readFileSync(file, "utf8")) || [];
  } catch {
    entries = [];
  }
}

/** Кинопоисковый id по TMDB id — для поиска и подборок. */
export function manualKinopoiskByTmdb(tmdbId, media) {
  load();
  const id = Number(tmdbId);
  const found = entries.find(
    (item) => Number(item.tmdbId) === id && (!media || !item.media || item.media === media)
  );
  return found ? Number(found.kinopoiskId) : null;
}

/** TMDB id по кинопоисковому — для страницы фильма и плеера. */
export function manualTmdbByKinopoisk(kinopoiskId) {
  load();
  const id = Number(kinopoiskId);
  const found = entries.find((item) => Number(item.kinopoiskId) === id);
  if (!found) return null;
  return {
    tmdbId: Number(found.tmdbId),
    media: found.media === "movie" ? "movie" : "tv",
  };
}

/** Сколько пар задано вручную — для диагностики. */
export function manualMapSize() {
  load();
  return entries.length;
}
