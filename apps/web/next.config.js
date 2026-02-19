/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@safeguard/shared', '@safeguard/database'],
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:3001'}/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
