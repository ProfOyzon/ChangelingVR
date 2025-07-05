import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/**`),
      new URL('https://xkdlj9yxxa926ujy.public.blob.vercel-storage.com/**'),
    ],
  },
};

export default nextConfig;
