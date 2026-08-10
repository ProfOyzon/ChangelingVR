// The page shows adjustable fields for the user's profile
// This includes the bio, terms, roles, and teams
import { Suspense } from 'react';
import { AboutMeSection } from '@/app/dashboard/profile/components/about-me';
import { DisplayNameSection } from '@/app/dashboard/profile/components/display-name';
import { RoleSelection } from '@/app/dashboard/profile/components/role-selection';
import { TeamSelection } from '@/app/dashboard/profile/components/team-selection';
import { YearSelection } from '@/app/dashboard/profile/components/year-selection';
import { getProfile } from '@/lib/db/queries';

export default function ProfilePage() {
  return (
    <main className="min-h-[calc(100dvh-7.5rem)] bg-slate-900 text-gray-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 p-6">
        <Suspense fallback={<ProfileSkeleton />}>
          <ProfileEditor />
        </Suspense>
      </div>
    </main>
  );
}

async function ProfileEditor() {
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6">
      <DisplayNameSection displayName={profile.displayName || ''} />
      <AboutMeSection bio={profile.bio || ''} />
      <YearSelection years={profile.terms || []} />
      <TeamSelection teams={profile.teams || []} />
      <RoleSelection roles={profile.roles || []} />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <>
      <div className="h-60.5 w-full animate-pulse rounded-md bg-slate-800" />
      <div className="h-73 w-full animate-pulse rounded-md bg-slate-800" />
      <div className="h-64 w-full animate-pulse rounded-md bg-slate-800" />
      <div className="h-64 w-full animate-pulse rounded-md bg-slate-800" />
    </>
  );
}
