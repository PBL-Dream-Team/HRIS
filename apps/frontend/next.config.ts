import 'dotenv/config';

const nextConfig = {
  distDir: '../../dist/apps/frontend',
  experimental: {
    allowedDevOrigins: [process.env.ALLOWED_DEV_ORIGIN!],
  },
} as unknown as import('next').NextConfig;

export default nextConfig;