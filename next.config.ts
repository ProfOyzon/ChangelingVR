import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://xkdlj9yxxa926ujy.public.blob.vercel-storage.com/**')],
  },
};

export default nextConfig;
