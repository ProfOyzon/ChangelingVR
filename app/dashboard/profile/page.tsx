// The page shows adjustable fields for the user's profile
// This includes the bio, terms, roles, and teams
import { Suspense } from 'react';
import { AboutMeSection } from '@/app/dashboard/profile/components/about-me';
import { RoleSelection } from '@/app/dashboard/profile/components/role-selection';
import { TeamSelection } from '@/app/dashboard/profile/components/team-selection';
import { YearSelection } from '@/app/dashboard/profile/components/year-selection';
import { getProfile } from '@/lib/db/queries';

function ProfileSkeleton() {
  return (
    <>
      <div className="h-49 w-full animate-pulse rounded-md bg-slate-800" />
      <div className="h-49 w-full animate-pulse rounded-md bg-slate-800" />
      <div className="h-49 w-full animate-pulse rounded-md bg-slate-800" />
      <div className="h-49 w-full animate-pulse rounded-md bg-slate-800" />
    </>
  );
}

async function ProfileEditor() {
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6">
      <AboutMeSection bio={profile.bio || ''} />
      <YearSelection years={profile.terms || []} />
      <TeamSelection teams={profile.teams || []} />
      <RoleSelection roles={profile.roles || []} />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <main className="min-h-[calc(100dvh-7.5rem)] bg-slate-900 text-gray-100">
      <header className="border-b border-gray-500/50">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-2 py-8 md:px-4">
          <h1 className="text-4xl font-bold">Profile</h1>
          <p className="text-gray-400">Manage your profile and settings.</p>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-2 py-8 md:px-4">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileEditor />
        </Suspense>
      </div>
    </main>
  );
}
