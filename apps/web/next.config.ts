import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@buscohuella/pet-domain',
    '@buscohuella/pet-data',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'tqdmykvnocpffzkcaysp.supabase.co',
        pathname:
          '/storage/v1/object/sign/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
