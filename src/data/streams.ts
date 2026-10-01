/**
 * Реестр готовых ссылок на видеопотоки.
 *
 * Сюда вручную вписываются ссылки, которые ты предоставляешь сам. Ключ — id
 * фильма из маршрута /film/{id} (тот же kinopoisk id, что и в URL страницы).
 *
 * Если для фильма есть запись — Filmhub показывает СВОЙ плеер и играет твою
 * ссылку. Если записи нет — работает прежний плеер (iframe), ничего не ломается.
 *
 * Формат ссылки можно не указывать: тип определится по расширению, а если
 * расширения нет — по Content-Type ответа. Если сервер не отдаёт CORS-заголовки
 * и определить не удалось, укажи `type` руками.
 */

export type StreamType = "hls" | "mp4" | "dash";

export type StreamVariant = {
  /** Готовая ссылка на поток: .m3u8, .mp4, .mpd или ссылка без расширения */
  url: string;
  /** Тип потока. Необязательно — определится автоматически */
  type?: StreamType;
  /** Подпись качества: "1080p", "720p", "4K" */
  quality?: string;
  /** Подпись дорожки: "Дубляж", "Многоголосый", "Оригинал" */
  audio?: string;
  /** Своё название варианта (если нужно) */
  title?: string;
  /**
   * Дополнительные заголовки запроса (Referer / User-Agent и т.п.).
   * Работают для HLS (hls.js подставляет их в XHR). Для MP4 и DASH браузер
   * задать заголовки не даёт — там нужен серверный прокси.
   */
  headers?: Record<string, string>;
};

export type FilmStreams = {
  title?: string;
  poster?: string;
  variants: StreamVariant[];
};

export const FILM_STREAMS: Record<string, FilmStreams> = {
  // ── Пример. Раскомментируй и подставь свои ссылки ───────────────────────────
  // "301": {
  //   title: "Матрица",
  //   variants: [
  //     { url: "https://cdn.example.com/matrix/1080p.m3u8", type: "hls", quality: "1080p", audio: "Дубляж" },
  //     { url: "https://cdn.example.com/matrix/720p.m3u8", quality: "720p", audio: "Дубляж" },
  //     { url: "https://cdn.example.com/matrix/orig.mp4", quality: "720p", audio: "Оригинал" },
  //   ],
  // },
};

/** Записи для фильма или null, если ссылки ещё не заданы */
export function getFilmStreams(id: string | number | null | undefined): FilmStreams | null {
  const key = String(id ?? "").trim();
  if (!key) return null;

  const entry = FILM_STREAMS[key];
  if (!entry) return null;

  const variants = (entry.variants || []).filter((variant) => Boolean(variant?.url));
  if (!variants.length) return null;

  return { ...entry, variants };
}

/** Добавить/заменить ссылки для фильма без правки этого файла (из кода или консоли) */
export function setFilmStreams(id: string | number, streams: FilmStreams) {
  FILM_STREAMS[String(id)] = streams;
}
