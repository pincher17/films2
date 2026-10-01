import type { StreamType } from "@/data/streams";

/**
 * Определение формата потока.
 *
 * Порядок: явно указанный тип -> расширение -> Content-Type ответа.
 * CORS может запретить чтение заголовков у чужого домена — тогда вернётся
 * последний вариант и в отчёте это будет видно.
 */

export type StreamFormat = StreamType;

export function formatFromUrl(url: string): StreamFormat | null {
  const clean = String(url || "").split("?")[0].split("#")[0].toLowerCase();
  if (clean.endsWith(".m3u8")) return "hls";
  if (clean.endsWith(".mpd")) return "dash";
  if (
    clean.endsWith(".mp4") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov")
  ) {
    return "mp4";
  }
  return null;
}

const CONTENT_TYPE_MAP: { match: RegExp; format: StreamFormat }[] = [
  { match: /mpegurl/i, format: "hls" },
  { match: /dash\+xml/i, format: "dash" },
  { match: /^video\/(mp4|webm|quicktime|x-matroska)/i, format: "mp4" },
];

async function formatFromHeaders(url: string): Promise<StreamFormat | null> {
  const read = async (method: "HEAD" | "GET") => {
    const response = await fetch(url, {
      method,
      headers: method === "GET" ? { Range: "bytes=0-2047" } : undefined,
    });
    const contentType = response.headers.get("content-type") || "";
    return CONTENT_TYPE_MAP.find((entry) => entry.match.test(contentType))?.format ?? null;
  };

  try {
    return await read("HEAD");
  } catch {
    // часть CDN не отвечает на HEAD — пробуем запросить первые байты
  }

  try {
    return await read("GET");
  } catch {
    // CORS или сеть: определить не получилось
  }

  return null;
}

export async function detectStreamFormat(
  url: string,
  explicit?: StreamType
): Promise<StreamFormat> {
  if (explicit) return explicit;

  const byExtension = formatFromUrl(url);
  if (byExtension) return byExtension;

  const byHeaders = await formatFromHeaders(url);
  if (byHeaders) return byHeaders;

  // не смогли определить: HLS — самый частый случай для потоковых ссылок
  return "hls";
}
