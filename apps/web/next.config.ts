import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? '192.168.0.12')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
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
