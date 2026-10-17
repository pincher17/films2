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
import { debug, debugWarn } from "@/lib/debug";
import { saveWatchPosition } from "@/api/watchPosition";
import { useAppSelector } from "@/redux/hooks";
import {
  clearCurrentEpisode,
  markPlayerReporting,
  setCurrentEpisode,
} from "@/data/currentEpisode";

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

/**
 * Разбор сообщения плеера. Формы событий разные, поэтому возвращаем
 * размеченный результат: либо прогресс, либо сведения о серии.
 */
type ParsedEvent =
  | { kind: "progress"; seconds: number; duration: number | null }
  | { kind: "duration"; duration: number }
  | { kind: "episode"; season: number | null; episode: number | null };

function readEvent(data: any): ParsedEvent | null {
  const event = String(data?.event || data?.name || "");

  // Смена серии: плеер сообщает, что дальше играет другая серия.
  // Идентификатор из сообщения не используем — только сезон и серию.
  if (event === "changeEpisode" || event === "episodechange" || event === "playlistItem") {
    return {
      kind: "episode",
      season: number(data?.season),
      episode: number(data?.episode),
    };
  }

  // Прогресс просмотра: имена полей у разных плееров отличаются
  if (event === "timeupdate" || event === "progress" || event === "viewProgress") {
    const seconds = number(data.value ?? data.seconds ?? data.time ?? data.timeSeconds);
    const duration = number(data.duration ?? data.total ?? data.length);
    if (seconds === null) return null;
    return { kind: "progress", seconds, duration };
  }

  // Отдельное событие длительности
  if (event === "duration") {
    const duration = number(data.value ?? data.seconds ?? data.duration);
    return duration === null ? null : { kind: "duration", duration };
  }

  return null;
}

const PlayerBridge: React.FC<Props> = ({ filmId, season = 0, episode = 0, saveEvery = 15000 }) => {
  const secondsRef = React.useRef(0);
  const durationRef = React.useRef<number | null>(null);
  const readyRef = React.useRef(false);
  const lastSavedRef = React.useRef(0);

  // Текущая серия, о которой сообщил плеер. Ключ записи для сериала —
  // (filmId, season, episode), поэтому её нужно запомнить и использовать во
  // всех последующих сохранениях. Начальные значения — из props страницы
  // (для фильма там нули, и если плеер о серии не сообщает, всё остаётся 0/0).
  const seasonRef = React.useRef(season);
  const episodeRef = React.useRef(episode);
  // Сообщил ли плеер серию за эту загрузку страницы
  const episodeKnownRef = React.useRef(false);

  // Тип контента — из уже загруженных данных страницы (селекторы серий внутри
  // iframe, оттуда их не прочитать)
  const filmType = useAppSelector((state) =>
    String((state.filmInfo?.info as { type?: string } | undefined)?.type || "")
  );
  const isSeries = /series/i.test(filmType);

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

    /* Для сериала плеер на компьютере не сообщает номер серии, и запись
       блокировалась целиком. Поэтому берём последнюю сохранённую серию из базы:
       человек продолжает ту же серию, и писать нужно именно в неё. */
    if (isSeries) {
      fetch(`/api/position?filmId=${filmId}&latest=1`, { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          const position = data?.position;
          if (!position) return;
          if (!seasonRef.current && position.season) seasonRef.current = position.season;
          if (!episodeRef.current && position.episode) episodeRef.current = position.episode;
          if (seasonRef.current || episodeRef.current) {
            episodeKnownRef.current = true;
            debug("[bridge] серия из базы:", seasonRef.current, episodeRef.current);
          }
        })
        .catch(() => undefined);
    }

    const save = (beacon: boolean) => {
      const seconds = Math.floor(secondsRef.current);
      const duration = durationRef.current ? Math.floor(durationRef.current) : undefined;

      if (!readyRef.current) return;
      if (seconds < MIN_SECONDS) return;

      // Сериал: пока плеер не сообщил серию, не пишем вовсе — иначе появится
      // ложная запись (season=0, episode=0) и фильм задвоится в ряду.
      // Для обычного фильма ключ (0,0) остаётся рабочим.
      if (isSeries && !episodeKnownRef.current) return;
      if (duration && seconds > duration + 5) return;
      if (Date.now() - lastSavedRef.current < 5000 && !beacon) return;

      lastSavedRef.current = Date.now();
      saveWatchPosition({
        filmId: Number(filmId),
        season: seasonRef.current,
        episode: episodeRef.current,
        seconds,
        duration,
        source: "player",
        beacon,
      });
    };


    /* Ищем номер серии в любом месте сообщения: плееры называют поля по-разному
       (season/episode, season_number/episode_number, s/e), и жёсткий разбор
       пропускал часть вариантов — из-за этого для сериалов не шла запись. */
    type EpisodeGuess = { season: number | null; episode: number | null };

    const findEpisodeRaw = (data: unknown, depth = 0): EpisodeGuess | null => {
      if (!data || typeof data !== "object" || depth > 4) return null;
      const pick = (keys: string[]): number | null => {
        for (const key of keys) {
          const value = (data as Record<string, unknown>)[key];
          if (value !== undefined && value !== null && value !== "") {
            const num = Number(value);
            if (Number.isFinite(num) && num >= 0) return num;
          }
        }
        return null;
      };
      const record = data as Record<string, unknown>;
      const season = pick(["season", "season_number", "seasonNumber", "s"]);
      const episode = pick(["episode", "episode_number", "episodeNumber", "e"]);
      if (season !== null || episode !== null) return { season, episode };
      for (const key of Object.keys(record)) {
        const found: EpisodeGuess | null = findEpisodeRaw(record[key], depth + 1);
        if (found) return found;
      }
      return null;
    };

    const onMessage = (event: MessageEvent) => {
      /* Диагностика протокола: нужна, чтобы понять, присылает ли плеер номер
         серии. Без этого приходится угадывать, и можно записать время не той серии. */
      try {
        if (typeof event.data === "string" && event.data.length < 400) {
          debug("[bridge] сырое сообщение:", event.data);
        } else if (event.data && typeof event.data === "object") {
          debug("[bridge] сырое сообщение:", JSON.stringify(event.data).slice(0, 300));
        }
      } catch {
        undefined;
      }

      if (stopped) return;

      // доверяем только своему iframe
      const origin = allowedOrigin();
      if (!origin || event.origin !== origin) return;

      const parsed = readEvent(event.data);
      const guess = findEpisodeRaw(event.data);

      // подробный вывод: видно, что именно прислал плеер и как это разобрано
      const secondsValue = parsed && "seconds" in parsed ? parsed.seconds : null;
      const durationValue = parsed && "duration" in parsed ? parsed.duration : null;

      debug("[bridge] сообщение", {
        разобрано: parsed?.kind || "не распознано",
        секунды: secondsValue,
        длительность: durationValue,
        серия: guess ? { сезон: guess.season, серия: guess.episode } : "нет",
        данные: typeof event.data === "string" ? event.data.slice(0, 220) : "[объект]",
      });

      if (!parsed) return;

      if (parsed.kind === "episode") {
        // Плеер переключил серию: запоминаем её и обнуляем позицию, иначе
        // секунды от предыдущей серии уедут в запись новой
        if (parsed.season !== null && parsed.season >= 0) seasonRef.current = parsed.season;
        if (parsed.episode !== null && parsed.episode >= 0) episodeRef.current = parsed.episode;
        secondsRef.current = 0;
        lastSavedRef.current = 0;
        // сообщаем трекеру, какая серия играет: он должен писать в тот же ключ
        setCurrentEpisode(seasonRef.current, episodeRef.current);
        episodeKnownRef.current = true;
        debug(
          `[bridge] серия: сезон ${seasonRef.current}, серия ${episodeRef.current} — позиция пишется отдельно`
        );
        return;
      }

      if (parsed.kind === "duration") {
        if (parsed.duration > 0) durationRef.current = parsed.duration;
        return;
      }

      if (parsed.duration && parsed.duration > 0) durationRef.current = parsed.duration;
      if (parsed.seconds > 0) secondsRef.current = parsed.seconds;

      /* Если парсер не увидел серию, но она есть в сообщении — запоминаем её.
         Без этого для сериалов на компьютере запись не шла вообще. */
      if (!episodeKnownRef.current) {
        const raw = findEpisodeRaw(event.data);
        if (raw && (raw.season !== null || raw.episode !== null)) {
          if (raw.season !== null) seasonRef.current = raw.season;
          if (raw.episode !== null) episodeRef.current = raw.episode;
          episodeKnownRef.current = true;
          setCurrentEpisode(seasonRef.current, episodeRef.current);
          debug("[bridge] серия найдена в сообщении:", seasonRef.current, episodeRef.current);
        }
      }

      if (!readyRef.current && secondsRef.current > 0) {
        readyRef.current = true;
        // с этого момента точный прогресс ведёт мост, оценка по времени не нужна
        markPlayerReporting();
        debug("[bridge] плеер отдаёт прогресс — позиция сохраняется на сервер");
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
      clearCurrentEpisode();
    };
  }, [filmId, season, episode, saveEvery, isSeries]);

  return null;
};

export default PlayerBridge;
