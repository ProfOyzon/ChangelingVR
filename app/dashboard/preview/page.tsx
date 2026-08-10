// This page shows the preview of the user's profile
import { Suspense } from 'react';
import { UserProfile } from '@/components/profile/user-profile';
import { getFullProfile } from '@/lib/db/queries';
import type { FullProfile } from '@/lib/db/schema';

function PreviewSkeleton() {
  return <div className="bg-dune mx-auto h-119 w-4xl animate-pulse rounded-sm" />;
}

async function Preview() {
  const profile = (await getFullProfile()) as FullProfile;
  if (!profile) return;
  return <UserProfile user={profile} />;
}

export default function PreviewPage() {
  return (
    <main className="min-h-[calc(100dvh-7.5rem)] bg-slate-900 text-gray-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 p-6">
        <Suspense fallback={<PreviewSkeleton />}>
          <Preview />
        </Suspense>

        <span className="text-center text-sm text-zinc-300">
          *Background is lighter when displayed on the site
        </span>
      </div>
    </main>
  );
}
