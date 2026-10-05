"use client";

/**
 * Универсальный адаптер событий прогресса от встроенного (iframe) плеера.
 *
 * Задача: получить от плеера текущую секунду и длительность и отдать их в
 * существующий /api/position. Ничего своего: ни таблиц, ни авторизации, ни
 * эндпоинтов — только перевод событий плеера в наш формат.
 *
 * Как это работает и почему безопасно:
 *   • прямое чтение из чужого iframe запрещено браузером, поэтому остаётся
 *     обмен сообщениями (postMessage);
 *   • доверенным считается ТОЛЬКО origin того iframe, который мы сами вставили
 *     на страницу — он вычисляется из его src. Никаких адресов провайдеров в
 *     коде нет: что вставили, тому и доверяем;
 *   • поддерживаются документированные формы событий разных плееров —
 *     playerjs-подобные (timeupdate/duration) и «прогресс» (progress/viewProgress
 *     с полями time/timeSeconds и duration);
 *   • сообщения посторонних фреймов и скриптов отбрасываются.
 *
 * Если плеер событий не отправляет, ничего не происходит: остаётся WatchTracker,
 * который считает время по действию пользователя.
 */

import React from "react";
import { saveWatchPosition } from "@/api/watchPosition";

type Props = {
  filmId: string | number;
  /** сезон и серия для сериалов; 0 для фильмов */
  season?: number;
  episode?: number;
  /** как часто писать позицию на сервер, мс */
  saveEvery?: number;
};

/** Минимальная позиция, которую имеет смысл запоминать */
const MIN_SECONDS = 10;
/** Сохраняем позицию как «досмотрено», если до конца меньше этого числа секунд */
const NEAR_END = 120;

const number = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

/** Ищем секунду и длительность в сообщении, не привязываясь к одному формату */
function readProgress(data: any): { seconds: number; duration: number | null } | null {
  const event = String(data?.event || data?.name || "");

  // playerjs-подобные события: { event: 'timeupdate', value: 12.5 }
  if (event === "timeupdate" || event === "progress" || event === "viewProgress") {
    const seconds = number(data.value ?? data.seconds ?? data.time ?? data.timeSeconds);
    const duration = number(data.duration ?? data.total ?? data.length);
    return seconds === null ? null : { seconds, duration };
  }

  // отдельное событие длительности
  if (event === "duration") {
    const duration = number(data.value ?? data.seconds ?? data.duration);
    return duration === null ? null : { seconds: 0, duration };
  }

  return null;
}

const PlayerBridge: React.FC<Props> = ({ filmId, season = 0, episode = 0, saveEvery = 15000 }) => {
  const secondsRef = React.useRef(0);
  const durationRef = React.useRef<number | null>(null);
  const readyRef = React.useRef(false);
  const lastSavedRef = React.useRef(0);

  React.useEffect(() => {
    if (!filmId) return;
    let stopped = false;

    const frame = () =>
      document.querySelector<HTMLIFrameElement>("#fh-player iframe");

    /** Разрешённый origin — тот, что у нашего же iframe */
    const allowedOrigin = (): string | null => {
      const src = frame()?.getAttribute("src") || "";
      try {
        return src ? new URL(src, window.location.href).origin : null;
      } catch {
        return null;
      }
    };

    const save = (beacon: boolean) => {
      const seconds = Math.floor(secondsRef.current);
      const duration = durationRef.current ? Math.floor(durationRef.current) : undefined;

      if (!readyRef.current) return;
      if (seconds < MIN_SECONDS) return;
      if (duration && seconds > duration + 5) return;
      if (Date.now() - lastSavedRef.current < 5000 && !beacon) return;

      lastSavedRef.current = Date.now();
      saveWatchPosition({
        filmId: Number(filmId),
        season,
        episode,
        seconds,
        duration,
        source: "player",
        beacon,
      });
    };

    const onMessage = (event: MessageEvent) => {
      if (stopped) return;

      // доверяем только своему iframe
      const origin = allowedOrigin();
      if (!origin || event.origin !== origin) return;

      const progress = readProgress(event.data);
      if (!progress) return;

      if (progress.duration && progress.duration > 0) durationRef.current = progress.duration;
      if (progress.seconds > 0) secondsRef.current = progress.seconds;

      if (!readyRef.current && secondsRef.current > 0) {
        readyRef.current = true;
        console.info("[bridge] плеер отдаёт прогресс — позиция сохраняется на сервер");
      }
    };

    window.addEventListener("message", onMessage);

    // Вежливая подписка для плееров, поддерживающих playerjs-протокол:
    // просим присылать события, если плеер их знает
    const ask = (method: string, value?: string) => {
      const node = frame();
      if (!node?.contentWindow) return;
      try {
        node.contentWindow.postMessage(JSON.stringify({ method, value }), "*");
      } catch {
        undefined;
      }
    };
    const timers = [0, 1500, 4000, 8000].map((delay) =>
      window.setTimeout(() => {
        if (stopped) return;
        ask("addEventListener", "timeupdate");
        ask("addEventListener", "duration");
      }, delay)
    );

    const interval = window.setInterval(() => save(false), saveEvery);
    const onHide = () => save(true);
    window.addEventListener("pagehide", onHide);

    return () => {
      stopped = true;
      timers.forEach((id) => window.clearTimeout(id));
      window.clearInterval(interval);
      window.removeEventListener("message", onMessage);
      window.removeEventListener("pagehide", onHide);
      save(true);
    };
  }, [filmId, season, episode, saveEvery]);

  return null;
};

export default PlayerBridge;
