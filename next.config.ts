import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Note: 'standalone' output requires symlink permissions on Windows
  // Uncomment for Docker deployments: output: 'standalone',
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
