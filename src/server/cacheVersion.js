import fs from "fs";
import path from "path";

/**
 * Версия данных файлового кэша.
 *
 * Поднимать её при смене источника или формата данных (например, когда рейтинг
 * начал браться из TMDB вместо Кинопоиска). Тогда при следующем запуске старые
 * файлы удаляются автоматически, и сервер не отдаёт устаревшие значения.
 *
 * Зачем это нужно: мы трижды ловили ошибки из-за того, что кэш переживал код —
 * «Продолжить просмотр» с навсегда записанными неудачами, рейтинги из
 * отключённого источника и разницу между карточкой и страницей фильма.
 */
export const CACHE_VERSION = 4;

const DIR = path.join(process.cwd(), ".cache");
const STAMP = path.join(DIR, "version.json");

let checked = false;

/**
 * Проверяет версию и при несовпадении очищает кэш. Вызывается при старте
 * модулей, которые читают кэш; повторные вызовы ничего не делают.
 */
export function ensureCacheVersion() {
  if (checked) return false;
  checked = true;

  try {
    fs.mkdirSync(DIR, { recursive: true });
    const stamp = JSON.parse(fs.readFileSync(STAMP, "utf8"));
    if (stamp?.version === CACHE_VERSION) return false;
  } catch {
    // штампа нет или он битый — считаем кэш устаревшим
  }

  try {
    for (const file of fs.readdirSync(DIR)) {
      if (file === "version.json") continue;
      fs.rmSync(path.join(DIR, file), { force: true, recursive: true });
    }
    console.info("[cache] версия изменилась — старый кэш очищен");
  } catch (error) {
    console.warn("[cache] не удалось очистить кэш:", error?.message);
  }

  try {
    fs.writeFileSync(STAMP, JSON.stringify({ version: CACHE_VERSION, at: new Date().toISOString() }));
  } catch {
    undefined;
  }

  return true;
}
