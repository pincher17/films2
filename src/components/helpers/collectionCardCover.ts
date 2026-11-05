/**
 * Обложка коллекции уменьшенного размера — только для карточки в ряду.
 *
 * Яндекс отдаёт обложки в полном размере (`/orig`): 520×520 у get-bunker и
 * 1080×1080 у get-kinopoisk-image. На сайте такая обложка выводится карточкой
 * 186×209 px, то есть в 2–5 раз крупнее, чем нужно.
 *
 * Замеры (карточка 186 px, для retina нужно 372 px):
 *   get-bunker        /orig 520×520, 158 КБ   → /M    318×318,  68 КБ (1,7×)
 *   get-kinopoisk-image /orig 1080×1080, 1,9 МБ → /400x 400×400, 360 КБ (2,15×)
 *
 * На обычном экране браузер сам уменьшает картинку — качество не меняется.
 * На retina у bunker-обложек остаётся ~85% плотности, у kinopoisk — полная.
 *
 * Важно: это только для карточки. В метаданных страницы коллекции остаётся
 * исходный `/orig`, потому что он уходит в og:image для соцсетей.
 */
const PRESETS: Array<[string, string]> = [
  ["get-bunker/", "/M"],
  ["get-kinopoisk-image/", "/400x"],
];

export default function collectionCardCover(url?: string | null) {
  if (!url) return url ?? "";
  for (const [namespace, size] of PRESETS) {
    if (url.includes(namespace)) return url.replace(/\/orig$/, size);
  }
  return url;
}
