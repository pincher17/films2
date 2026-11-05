/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // В разработке service worker только мешает: он кэширует бандлы и стили,
  // из-за чего правки не видны без жёсткого обновления, и засоряет консоль
  // отладочными сообщениями Workbox. В продакшене PWA остаётся включённым.
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  env: {
    apiKey: process.env.API_KEY,
    apigetKey: process.env.APIGET_KEY,
  },
  /* robots.txt и карты сайта меняются, а Next отдавал их как статику с
     cache-control: immutable на год. Google легко закэшировал бы старый
     robots.txt с полным запретом обхода. Ставим час. */
  async headers() {
    /* robots.txt и индекс отдаются роутами — им заголовок не нужен.
       Остаются статические части карты из public/. */
    const files = ['/sitemap1.xml', '/sitemap2.xml', '/sitemap3.xml', '/sitemap4.xml'];
    return files.map((source) => ({
      source,
      headers: [{ key: 'Cache-Control', value: 'public, max-age=3600' }],
    }));
  },
  async rewrites() {
    return [
      // картинки TMDB через наш домен: у части провайдеров их CDN заблокирован
      { source: '/img/:path*', destination: 'https://image.tmdb.org/t/p/:path*' },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.mds.yandex.net',
        port: '',
        pathname: '**',
      },
    ],
  },
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
});