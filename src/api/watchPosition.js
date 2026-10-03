/**
 * Синхронизация позиции просмотра с сервером.
 *
 * Локальное хранилище остаётся запасным вариантом: если сервер недоступен,
 * воспроизведение и запоминание позиции работают как раньше.
 * Все функции намеренно «не бросают» — плеер не должен падать из-за сети.
 */

export async function loadWatchPosition({ filmId, season = 0, episode = 0 }) {
  try {
    const response = await fetch(
      `/api/position?filmId=${filmId}&season=${season}&episode=${episode}`,
      { cache: "no-store" }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.position || null;
  } catch {
    return null;
  }
}

export function saveWatchPosition({
  filmId,
  seconds,
  duration,
  season = 0,
  episode = 0,
  beacon = false,
}) {
  if (!filmId || !Number.isFinite(seconds)) return;

  const body = JSON.stringify({ filmId, season, episode, seconds, duration });

  // при закрытии вкладки обычный запрос может не успеть уйти — sendBeacon надёжнее
  if (beacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
    try {
      navigator.sendBeacon("/api/position", new Blob([body], { type: "application/json" }));
      return;
    } catch {
      undefined;
    }
  }

  fetch("/api/position", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}
