/**
 * Текущая серия, о которой сообщил встроенный плеер.
 *
 * Общий модуль для двух механизмов: PlayerBridge (пишет точный прогресс)
 * и WatchTracker (считает время, когда плеер событий не отдаёт). Без него
 * трекер писал бы в ключ (filmId, 0, 0) и создавал для сериала ложную запись.
 *
 * Состояние живёт в памяти вкладки: перезагрузка страницы его сбрасывает,
 * и это правильно — серия определяется заново самим плеером.
 */

export type CurrentEpisode = { season: number; episode: number };

let current: CurrentEpisode | null = null;
let playerReporting = false;

/** Плеер сообщил, какая серия играет */
export function setCurrentEpisode(season: number, episode: number) {
  current = { season, episode };
}

/** Какая серия играет сейчас; null — плеер о серии не сообщал */
export function getCurrentEpisode(): CurrentEpisode | null {
  return current;
}

export function clearCurrentEpisode() {
  current = null;
}

/**
 * Плеер отдаёт точный прогресс. Тогда оценка по времени у плеера не нужна:
 * она бы создавала вторую запись по другому ключу.
 */
export function markPlayerReporting() {
  playerReporting = true;
}

export function isPlayerReporting(): boolean {
  return playerReporting;
}

export function resetPlayerReporting() {
  playerReporting = false;
}
