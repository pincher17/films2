/**
 * Определение телевизора.
 *
 * Пользовательский агент — единственное, что отдаёт пульт: у Tizen, webOS,
 * Android TV, Apple TV и приставок он содержит характерные слова. Ложные
 * срабатывания не страшны: для проверки на компьютере есть ?tv=1, а на самом
 * телевизоре даже ошибка приведёт лишь к другой вёрстке.
 */
const TV_PATTERN =
  /(smart-?tv|smarttv|tizen|web0s|webos|netcast|hbbtv|viera|aquos|bravia|android ?tv|google ?tv|appletv|apple tv|roku|crkey|xbox|playstation|opera tv|dtv|pov_tv|googletv|mibox|shield)/i;

export function isTvUserAgent(userAgent: string | null | undefined) {
  if (!userAgent) return false;
  return TV_PATTERN.test(userAgent);
}

/** Телевизор или принудительный режим через ?tv=1 (для проверки на компьютере) */
export function isTvRequest(userAgent: string | null | undefined, forceTv: boolean) {
  return forceTv || isTvUserAgent(userAgent);
}
