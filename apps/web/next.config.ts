import type { NextConfig } from 'next';
import { join } from 'node:path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: join(
    __dirname,
    '../..',
  ),
  outputFileTracingIncludes: {
    '/*': [
      '../../node_modules/.pnpm/@img+sharp-libvips-*/node_modules/@img/sharp-libvips-*/lib/**/*',
    ],
  },
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
      // Vercel still enforces its own 4.5 MB raw request limit.
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
