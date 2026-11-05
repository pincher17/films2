/**
 * Индексная карта сайта: три части по 26–28 тысяч адресов.
 * Как и robots.txt, отдаём роутом ради нормального cache-control.
 */
export const dynamic = "force-static";

const BODY = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://filmhub.one/sitemap1.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://filmhub.one/sitemap2.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://filmhub.one/sitemap3.xml</loc>
  </sitemap>
  <sitemap>
    <loc>https://filmhub.one/sitemap4.xml</loc>
  </sitemap>
</sitemapindex>
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
