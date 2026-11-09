"use client";

/**
 * Позиция просмотра для встроенного плеера.
 *
 * Плеер понимает параметры адреса ?season=&episode=&t= и они главнее его
 * собственного localStorage (проверено: при сохранённых 82 секундах и ?t=300
 * воспроизведение начинается с 307-й). Поэтому «продолжить» делаем через адрес,
 * а не через плашку.
 *
 * Позиция лежит в базе у профиля (cookie fh_profile, после входа — у аккаунта),
 * значит переезжает между устройствами.
 *
 * Если позиции нет, она слишком ранняя или почти закончилась — возвращаем null,
 * и адрес плеера остаётся прежним.
 */

import React from "react";
import { setCurrentEpisode } from "@/data/currentEpisode";

export type WatchResume = { season: number; episode: number; seconds: number };

/** Меньше минуты — не считаем начатым */
const MIN_SECONDS = 45;
/** Ближе этого к концу — начинаем заново */
const TAIL_SECONDS = 90;
/** Дольше этого позицию не ждём: плеер важнее */
const GUARD_MS = 500;

export default function useWatchResume(filmId: number) {
  const [resume, setResume] = React.useState<WatchResume | null>(null);
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (!filmId) {
      setChecked(true);
      return;
    }

    let cancelled = false;
    const guard = window.setTimeout(() => {
      if (!cancelled) setChecked(true);
    }, GUARD_MS);

    (async () => {
      try {
        const response = await fetch(`/api/position?filmId=${filmId}&latest=1`, {
          cache: "no-store",
        });
        if (!response.ok) return;

        const data = await response.json();
        const position = data?.position;
        if (cancelled || !position) return;

        const seconds = Number(position.seconds) || 0;
        const duration = Number(position.duration) || 0;
        if (seconds < MIN_SECONDS) return;
        if (duration && seconds > duration - TAIL_SECONDS) return;

        const season = Number(position.season) || 0;
        const episode = Number(position.episode) || 0;
        setResume({ season, episode, seconds });
        /* Иначе трекер запишет прогресс в ключ (0,0) и позиция потеряется */
        if (season && episode) setCurrentEpisode(season, episode);
      } catch {
        undefined;
      } finally {
        if (!cancelled) {
          window.clearTimeout(guard);
          setChecked(true);
        }
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(guard);
    };
  }, [filmId]);

  return { resume, checked };
}

/** Адрес плеера с позицией; без позиции — ровно тот, что был */
export function withResume(src: string, resume: WatchResume | null) {
  if (!resume) return src;

  const params = new URLSearchParams();
  if (resume.season > 0) params.set("season", String(resume.season));
  if (resume.episode > 0) params.set("episode", String(resume.episode));
  params.set("t", String(Math.max(0, Math.floor(resume.seconds))));
  return `${src}?${params.toString()}`;
}
