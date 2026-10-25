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