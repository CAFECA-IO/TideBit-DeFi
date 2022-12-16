/** @type {import('next').NextConfig} */
const {i18n} = require('./next-i18next.config');
const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  env: {
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
  },
};

module.exports = nextConfig;
