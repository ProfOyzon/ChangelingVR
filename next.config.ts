import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xkdlj9yxxa926ujy.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
    turbopackRustReactCompiler: true,
    turbopackFileSystemCacheForBuild: true,
    useOffline: true,
  },
  redirects: async () => {
    return [
      {
        source: '/discord',
        destination: 'https://discord.gg/btEUjqazvP',
        permanent: false,
      },
      {
        source: '/instagram',
        destination: 'https://www.instagram.com/changelingvr',
        permanent: false,
      },
      {
        source: '/twitter',
        destination: 'https://x.com/ChangelingVR',
        permanent: false,
      },
      {
        source: '/x',
        destination: 'https://x.com/ChangelingVR',
        permanent: false,
      },
      {
        source: '/youtube',
        destination: 'https://www.youtube.com/@ChangelingVRStudio',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
