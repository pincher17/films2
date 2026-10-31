/**
 * Достаёт число из начала строки — например из «79848-сопрано» → 79848.
 *
 * Для адресов с imdb id («tt0133093») числа в начале нет, поэтому возвращаем 0:
 * раньше здесь падало чтение match[0], когда совпадения не было.
 */
function extractDigits(inputString) {
  const match = String(inputString ?? "").match(/^\d+/);
  return match ? Number(match[0]) : 0;
}

export default extractDigits;
