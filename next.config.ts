import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    remotePatterns: [
      new URL(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/**`),
      new URL('https://xkdlj9yxxa926ujy.public.blob.vercel-storage.com/**'),
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
