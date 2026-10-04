"use client";

/**
 * Учёт просмотра для встроенного плеера (fallback).
 *
 * Позицию из чужого iframe прочитать нельзя, поэтому считаем время, которое
 * человек реально провёл у плеера, и записываем сам факт просмотра.
 *
 * Отсчёт стартует ТОЛЬКО по действию пользователя, никогда — по факту
 * открытия страницы:
 *   1) клик по нашей кнопке «Смотреть» (событие fh:watch-start);
 *   2) первое взаимодействие с плеером: окно теряет фокус, а активный элемент
 *      становится iframe — иначе это событие не отличить от ухода со страницы.
 *
 * Тик раз в секунду, но время идёт только когда вкладка видима и плеер на
 * экране. Поэтому свёрнутый браузер, другая вкладка и прокрутка к «Похожим»
 * не считаются. Полный экран, наоборот, считается: вкладка остаётся активной.
 */

import React from "react";

type Props = {
  filmId: string | number;
  /** сезон и серия для сериалов; 0 для фильмов */
  season?: number;
  episode?: number;
};

/** Потолок накопления: точнее двух минут всё равно не узнать */
const MAX_TOTAL = 120;
/** Как часто отправляем накопленное на сервер */
const BEAT_EVERY = 60;
const PLAYER_SELECTOR = "#fh-player";

const WatchTracker: React.FC<Props> = ({ filmId, season = 0, episode = 0 }) => {
  const started = React.useRef(false);
  const sinceLastBeat = React.useRef(0);
  const total = React.useRef(0);

  React.useEffect(() => {
    if (!filmId) return;
    let stopped = false;

    const post = (path: string, body: unknown, beacon = false) => {
      const payload = JSON.stringify(body);
      if (beacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
        try {
          navigator.sendBeacon(path, new Blob([payload], { type: "application/json" }));
          return;
        } catch {
          undefined;
        }
      }
      fetch(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => undefined);
    };

    const start = (reason: string) => {
      if (started.current || stopped) return;
      started.current = true;
      console.info("[watch] отсчёт начат:", reason);
      post("/api/watch/start", { filmId: Number(filmId), season, episode });
    };

    const beat = (beacon = false) => {
      const seconds = Math.floor(sinceLastBeat.current);
      if (!started.current || seconds < 5) return;
      sinceLastBeat.current -= seconds;
      post("/api/watch/beat", { filmId: Number(filmId), season, episode, seconds }, beacon);
    };

    // сигнал 1: наша кнопка «Смотреть»
    const onOurButton = () => start("кнопка «Смотреть»");
    window.addEventListener("fh:watch-start", onOurButton);

    // сигнал 2: клик внутрь НАШЕГО плеера. Проверка на вложенность обязательна:
    // на странице есть и другие iframe (трейлер), и клик по ним не должен
    // засчитываться как просмотр фильма.
    const inOurPlayer = (node: Element | null) => {
      const player = document.querySelector(PLAYER_SELECTOR);
      return Boolean(node && player && player.contains(node));
    };

    const trailerOpen = () => Boolean(document.querySelector('[data-trailer-open="true"]'));

    const onBlur = () =>
      window.setTimeout(() => {
        if (stopped || document.visibilityState !== "visible") return;
        if (trailerOpen()) return;
        const active = document.activeElement;
        if (active?.tagName === "IFRAME" && inOurPlayer(active)) start("клик по плееру");
      }, 0);
    window.addEventListener("blur", onBlur);

    const playerOnScreen = () => {
      const node = document.querySelector(PLAYER_SELECTOR);
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const tick = window.setInterval(() => {
      if (stopped || !started.current) return;
      if (document.visibilityState !== "visible") return;
      // пока открыт трейлер, время фильма не идёт
      if (trailerOpen()) return;
      if (!playerOnScreen()) return;
      if (total.current >= MAX_TOTAL) return;

      total.current += 1;
      sinceLastBeat.current += 1;
      if (sinceLastBeat.current >= BEAT_EVERY) beat(false);
    }, 1000);

    const onHide = () => beat(true);
    window.addEventListener("pagehide", onHide);

    return () => {
      stopped = true;
      window.clearInterval(tick);
      window.removeEventListener("fh:watch-start", onOurButton);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pagehide", onHide);
      beat(true);
    };
  }, [filmId, season, episode]);

  return null;
};

export default WatchTracker;
