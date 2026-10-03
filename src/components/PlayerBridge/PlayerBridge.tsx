"use client";

/**
 * Мост к встроенному (iframe) плееру.
 *
 * Позицию просмотра нельзя прочитать из чужого iframe напрямую — браузер это
 * запрещает. Но многие плееры умеют протокол playerjs: обмен сообщениями через
 * postMessage. Этот компонент подписывается на события такого плеера и пишет
 * текущую секунду в нашу базу — тогда «Продолжить просмотр» работает и со
 * встроенным плеером.
 *
 * Компонент универсальный: он не знает, какой именно плеер вставлен, и не
 * зависит от источника видео. Если плеер не поддерживает playerjs, сообщений
 * просто не придёт — и мы это увидим в консоли.
 */

import React from "react";
import { saveWatchPosition } from "@/api/watchPosition";

type Props = {
  filmId: string | number;
  /** сезон и серия для сериалов; 0 для фильмов */
  season?: number;
  episode?: number;
  /** интервал сохранения, мс */
  saveEvery?: number;
};

const PlayerBridge: React.FC<Props> = ({ filmId, season = 0, episode = 0, saveEvery = 20000 }) => {
  const timeRef = React.useRef(0);
  const durationRef = React.useRef(0);
  const readyRef = React.useRef(false);
  const seenRef = React.useRef(0);

  React.useEffect(() => {
    if (!filmId) return;
    let stopped = false;

    const findFrame = (): HTMLIFrameElement | null =>
      document.querySelector<HTMLIFrameElement>("#fh-player iframe");

    // плеер может создаваться позже — пробуем несколько раз
    const registrations: number[] = [];
    const subscribe = (frame: HTMLIFrameElement) => {
      if (!frame.contentWindow) return;
      const ask = (method: string, value?: unknown) => {
        try {
          frame.contentWindow?.postMessage(JSON.stringify({ method, value }), "*");
        } catch {
          undefined;
        }
      };
      ask("addEventListener", "ready");
      ask("addEventListener", "timeupdate");
      ask("addEventListener", "duration");
      ask("addEventListener", "play");
      ask("getDuration");
    };

    const timers = [0, 1500, 4000, 8000].map((delay) =>
      window.setTimeout(() => {
        if (stopped) return;
        const frame = findFrame();
        if (frame) subscribe(frame);
      }, delay)
    );
    registrations.push(...timers);

    const onMessage = (event: MessageEvent) => {
      let data: any = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (!data || typeof data !== "object") return;

      // некоторые плееры шлют объект вида { event, value }
      const name = data.event;
      if (!name) return;

      // Показываем первые события, чтобы видеть, отвечает ли плеер вообще.
      // «Готовым» считаем только timeupdate/duration — посторонние скрипты на
      // странице тоже шлют сообщения с полем event, и раньше это давало ложный сигнал.
      if (seenRef.current < 15) {
        seenRef.current += 1;
        console.debug("[bridge] сообщение:", name, data.value ?? "");
      }

      if (name !== "timeupdate" && name !== "duration") return;

      if (!readyRef.current) {
        readyRef.current = true;
        console.info("[bridge] плеер отвечает по playerjs — синхронизация позиции включена");
      }

      if (name === "timeupdate") {
        const value = Number(data.value ?? data.seconds ?? 0);
        if (Number.isFinite(value) && value > 0) timeRef.current = value;
      } else if (name === "duration") {
        const value = Number(data.value ?? data.seconds ?? 0);
        if (Number.isFinite(value) && value > 0) durationRef.current = value;
      }
    };

    window.addEventListener("message", onMessage);

    const save = (beacon: boolean) => {
      const seconds = Math.floor(timeRef.current);
      if (!readyRef.current || seconds <= 15) return;
      saveWatchPosition({
        filmId: Number(filmId),
        season,
        episode,
        seconds,
        duration: durationRef.current ? Math.floor(durationRef.current) : undefined,
        beacon,
      });
    };

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
