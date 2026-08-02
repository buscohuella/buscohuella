import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@buscohuella/pet-domain',
    '@buscohuella/pet-data',
  ],
};

export default nextConfig;
