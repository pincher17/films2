import { debug, debugWarn } from "@/lib/debug";

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
  source = "fallback",
  beacon = false,
}) {
  /* Диагностика: раньше функция молча выходила при неверном filmId, и понять,
     почему позиция не сохраняется, было нельзя. */
  if (!filmId || !Number.isFinite(seconds)) {
    debugWarn("[position] не отправляю: filmId =", filmId, "| seconds =", seconds);
    return;
  }

  const body = JSON.stringify({ filmId, season, episode, seconds, duration, source });
  debug("[position] отправляю:", { filmId, season, episode, seconds, source });

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
  })
    .then((response) => {
      if (!response.ok) console.warn("[position] сервер ответил:", response.status);
    })
    .catch((error) => debugWarn("[position] ошибка сети:", error?.message));
}
