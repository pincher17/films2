"use client";

/**
 * Мост к встроенному (iframe) плееру.
 *
 * Время из чужого iframe напрямую не прочитать — браузер запрещает. Но плееры
 * поддерживают протокол playerjs: обмен сообщениями через postMessage, и
 * официальный SDK делает рукопожатие правильно (рукописный вариант не работал —
 * события от плеера не доходили).
 *
 * Компонент универсален: он не знает, какой плеер вставлен и откуда видео.
 * Если плеер playerjs не поддерживает — событий не будет, и мы это увидим.
 */

import React from "react";
import { saveWatchPosition } from "@/api/watchPosition";

type Props = {
  filmId: string | number;
  season?: number;
  episode?: number;
  saveEvery?: number;
};

const PlayerBridge: React.FC<Props> = ({ filmId, season = 0, episode = 0, saveEvery = 20000 }) => {
  const timeRef = React.useRef(0);
  const durationRef = React.useRef(0);
  const readyRef = React.useRef(false);

  React.useEffect(() => {
    if (!filmId) return;
    let stopped = false;
    let player: any = null;
    const timers: number[] = [];

    const attach = async () => {
      const frame = document.querySelector<HTMLIFrameElement>("#fh-player iframe");
      if (!frame || stopped) return false;
      try {
        const mod: any = await import("playerjs");
        const Player = mod?.default ?? mod?.Player ?? mod;
        player = new Player(frame);

        player.on("ready", () => {
          readyRef.current = true;
          console.info("[bridge] плеер на связи (playerjs) — синхронизация включена");
          try {
            player.getDuration();
          } catch {
            undefined;
          }
        });

        player.on("timeupdate", (data: any) => {
          const value = Number(typeof data === "object" ? data?.seconds ?? data?.value : data);
          if (Number.isFinite(value) && value > 0) timeRef.current = value;
        });

        player.on("duration", (data: any) => {
          const value = Number(typeof data === "object" ? data?.seconds ?? data?.value : data);
          if (Number.isFinite(value) && value > 0) durationRef.current = value;
        });

        return true;
      } catch (error: any) {
        console.warn("[bridge] не удалось подключиться к плееру:", error?.message);
        return false;
      }
    };

    // плеер может появиться позже — пробуем несколько раз
    [0, 1500, 4000, 8000].forEach((delay) => {
      timers.push(
        window.setTimeout(() => {
          if (!stopped && !readyRef.current) attach();
        }, delay)
      );
    });

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
      window.removeEventListener("pagehide", onHide);
      save(true);
      try {
        player?.off?.("timeupdate");
        player?.off?.("duration");
      } catch {
        undefined;
      }
    };
  }, [filmId, season, episode, saveEvery]);

  return null;
};

export default PlayerBridge;
