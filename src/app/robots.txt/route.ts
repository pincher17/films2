/**
 * robots.txt отдаём роутом, а не статическим файлом: Next подмешивал к статике
 * свой cache-control с immutable на год, и Google мог держать старую версию
 * с полным запретом обхода. Здесь заголовок ровно один и живёт час.
 */
export const dynamic = "force-static";

const BODY = `User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://filmhub.one/sitemap.xml
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
