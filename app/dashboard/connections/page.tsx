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
import { Link2Icon } from 'lucide-react';
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

export default function ConnectionsPage() {
  return (
    <main className="min-h-[calc(100dvh-7.5rem)] bg-slate-900 text-gray-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        <Suspense fallback={<ConnectionSkeleton />}>
          <Connections />
        </Suspense>
      </div>
    </main>
  );
}

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

      {connections.length > 0 ? (
        <>
          <div className="border border-gray-500/50" />
          {connections.map((c) => (
            <ConnectionCard key={c.platform} connection={c} />
          ))}
        </>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center rounded-sm bg-slate-800 text-center">
          <Link2Icon className="text-light-mustard mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No connections configured</h3>
          <p className="text-muted-foreground max-w-sm text-sm">
            You haven&apos;t connected any social media accounts or websites yet. Use the buttons
            above to add your connections and showcase them on your profile.
          </p>
        </div>
      )}
    </>
  );
}

function ConnectionSkeleton() {
  return (
    <>
      <div className="flex flex-row flex-wrap items-center gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
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
