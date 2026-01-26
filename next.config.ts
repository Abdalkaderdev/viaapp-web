import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@viaapp/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.viaapp.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
