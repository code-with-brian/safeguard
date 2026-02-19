/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@safeguard/shared', '@safeguard/database'],
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1',
  },
};

module.exports = nextConfig;
