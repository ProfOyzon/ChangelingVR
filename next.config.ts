import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://xkdlj9yxxa926ujy.public.blob.vercel-storage.com/**')],
  },
  experimental: {
    browserDebugInfoInTerminal: true,
    clientSegmentCache: true,
    devtoolSegmentExplorer: true,
  },
};

export default nextConfig;
