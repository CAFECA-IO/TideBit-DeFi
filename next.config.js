/** @type {import('next').NextConfig} */
const {i18n} = require('./next-i18next.config');
const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
    PUSHER_HOST: process.env.PUSHER_HOST,
    PUSHER_PORT: process.env.PUSHER_PORT,
    API_URL: process.env.API_URL,
    BAIFA_ID: process.env.BAIFA_ID,
    BAIFA_SECRET_KEY: process.env.BAIFA_SECRET_KEY,
    BAIFA_PROJECT_ID: process.env.BAIFA_PROJECT_ID,
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          {key: 'Access-Control-Allow-Credentials', value: 'true'},
          {key: 'Access-Control-Allow-Origin', value: '*'},
          {key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'},
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
