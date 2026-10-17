/**
 * Отладочный вывод.
 *
 * Диагностика плеера и сохранения позиции нужна при разработке, но в продакшене
 * это шум в консоли у посетителей. Ошибки (console.warn/error) оставляем всегда —
 * они помогают замечать настоящие сбои.
 */
const isDev = process.env.NODE_ENV !== "production";

export function debug(...args) {
  if (isDev) console.info(...args);
}

export function debugWarn(...args) {
  if (isDev) console.warn(...args);
}
