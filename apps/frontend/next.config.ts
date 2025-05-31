import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: '../../dist/apps/frontend',
};

module.exports = {
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;
