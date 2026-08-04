import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@buscohuella/pet-domain',
    '@buscohuella/pet-data',
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
