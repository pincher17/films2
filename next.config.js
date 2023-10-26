/** @type {import('next').NextConfig} */

module.exports = {
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