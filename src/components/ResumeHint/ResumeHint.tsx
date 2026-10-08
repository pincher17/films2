"use client";

/**
 * Плашка «вы остановились здесь».
 *
 * Встроенный плеер не умеет возвращаться на сохранённую минуту и не даёт
 * выбрать серию — поэтому вместо автопродолжения показываем человеку, где он
 * остановился, чтобы он вернулся туда сам. Плашка появляется только когда
 * позиция действительно есть и просмотрено больше минуты.
 */

import React from "react";
import {
  HintBar,
  HintFill,
  HintIcon,
  HintRow,
  HintText,
  HintWrapper,
} from "@/app/styles/ResumeHint.styles";

type Position = {
  seconds?: number;
  duration?: number | null;
  season?: number;
  episode?: number;
  source?: string;
};

/** 15:00 или 1:31:44 — часы добавляются только когда они есть */
const timecode = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = Math.floor(seconds % 60);
  const mm = String(minutes).padStart(hours ? 2 : 1, "0");
  const ss = String(rest).padStart(2, "0");
  return hours ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
};

const ResumeHint: React.FC<{ filmId: string | number }> = ({ filmId }) => {
  const [position, setPosition] = React.useState<Position | null>(null);

  React.useEffect(() => {
    if (!filmId) return;
    let alive = true;

    fetch(`/api/position?filmId=${filmId}&latest=1`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (alive) setPosition(data?.position || null);
      })
      .catch(() => undefined);

    return () => {
      alive = false;
    };
  }, [filmId]);

  const seconds = Math.floor(Number(position?.seconds) || 0);

  // меньше минуты — это ещё не «остановился», показывать нечего
  if (!position || seconds < 60) return null;

  const duration = Number(position.duration) || 0;
  const percent = duration
    ? Math.max(2, Math.min(100, Math.round((seconds / duration) * 100)))
    : null;

  const series =
    position.season && position.episode
      ? `Сезон ${position.season}, серия ${position.episode} · `
      : "";

  return (
    <HintWrapper title="Плеер не умеет возвращаться сам — промотайте на эту отметку">
      <HintRow>
        <HintIcon>
          <svg width="11" height="13" viewBox="0 0 10 12" aria-hidden="true">
            <path
              d="M1 1.1c0-.8.86-1.28 1.54-.87l6.4 3.9c.66.4.66 1.34 0 1.74l-6.4 3.9C1.86 10.18 1 9.7 1 8.9V1.1z"
              fill="currentColor"
            />
          </svg>
        </HintIcon>
        <HintText>
          Вы остановились: {series}
          <b>{timecode(seconds)}</b>
        </HintText>
      </HintRow>
      {percent !== null ? (
        <HintBar>
          <HintFill $percent={percent} />
        </HintBar>
      ) : null}
    </HintWrapper>
  );
};

export default ResumeHint;
