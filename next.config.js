/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    apiKey: process.env.API_KEY,
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
    // Enables the styled-components SWC transform
    styledComponents: true
  },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      })
      return config;
    }
  };