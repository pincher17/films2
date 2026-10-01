/**
 * Проверка Cloudflare Turnstile нужна только в продакшене.
 * При локальной разработке (next dev) она отключается автоматически, а при
 * необходимости её можно выключить принудительно: NEXT_PUBLIC_DISABLE_TURNSTILE=true.
 *
 * Значение вычисляется из переменных окружения, которые Next подставляет на
 * этапе сборки, поэтому сервер и клиент видят одно и то же — рассинхрона
 * гидратации не будет.
 */
export function isTurnstileDisabled(): boolean {
  if (process.env.NEXT_PUBLIC_DISABLE_TURNSTILE === "true") return true;
  return process.env.NODE_ENV !== "production";
}

export default isTurnstileDisabled;
