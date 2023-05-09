/** @type {import('next').NextConfig} */
const {i18n} = require('./next-i18next.config');
const nextConfig = {
  i18n,
  reactStrictMode: true,
  swcMinify: true,
  env: {
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID,
    PUSHER_API: process.env.PUSHER_API,
    PUSHER_KEY: process.env.PUSHER_KEY,
    PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,
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
