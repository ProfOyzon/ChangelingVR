// This page shows links that the user has connected
// It will be displayed on the user's profile if toggled on
import { Suspense } from 'react';
import {
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from 'react-icons/fa6';
import { getConnections } from '@/lib/db/queries';
import { ConnectionCard } from './components/connection-card';
import { ConnectionIcon } from './components/connection-icon';

const platformMap: Record<string, React.ReactNode> = {
  github: <FaGithub className="size-6" />,
  linkedin: <FaLinkedin className="size-6" />,
  x: <FaXTwitter className="size-6" />,
  instagram: <FaInstagram className="size-6" />,
  email: <FaEnvelope className="size-6" />,
  website: <FaGlobe className="size-6" />,
};

async function Connections() {
  const connections = await getConnections();
  if (!connections) return null;

  return (
    <>
      <div className="flex flex-row flex-wrap items-center gap-4">
        {Object.entries(platformMap).map(([platform, icon]) => (
          <ConnectionIcon
            key={platform}
            platform={platform}
            icon={icon}
            disabled={connections.some((c) => c.platform === platform)}
          />
        ))}
      </div>

      <div className="border border-gray-500/50" />

      {connections.map((c) => (
        <ConnectionCard key={c.platform} connection={c} />
      ))}
    </>
  );
}

function ConnectionSkeleton() {
  return (
    <>
      <div className="flex flex-row flex-wrap items-center gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="size-10.5 animate-pulse rounded-md bg-gray-700" />
        ))}
      </div>

      <div className="border border-gray-500/50" />

      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="h-35.5 w-full animate-pulse rounded-md bg-gray-700" />
      ))}
    </>
  );
}

export default async function ConnectionsPage() {
  return (
    <main className="min-h-[calc(100dvh-7.5rem)] bg-slate-900 text-gray-100">
      <header className="border-b border-gray-500/50">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8">
          <h1 className="text-4xl font-bold">Connections</h1>
          <p className="text-gray-400">Manage your connections to other services.</p>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-2 space-y-6 px-4 py-8">
        <Suspense fallback={<ConnectionSkeleton />}>
          <Connections />
        </Suspense>
      </div>
    </main>
  );
}
