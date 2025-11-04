import { ProfileCard } from '@/app/teams/components/profile-card';
import { getFilteredProfiles } from '@/lib/db/queries';
import type { FullProfile } from '@/lib/db/schema';

export function TableSkeleton() {
  return (
    <div className="flex w-full max-w-7xl flex-wrap items-center justify-center gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-64 w-40 animate-pulse rounded-md bg-gray-700" />
      ))}
    </div>
  );
}

export async function Table({ query, page }: { query: string; page: string }) {
  const profiles = (await getFilteredProfiles(query, Number(page))) as FullProfile[];

  if (!profiles || profiles.length === 0) {
    return (
      <div className="flex w-full max-w-7xl flex-wrap items-center justify-center gap-4">
        <p className="text-gray-500">No profiles found</p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-7xl flex-wrap items-center justify-center gap-4">
      {profiles.map((profile) => (
        <ProfileCard key={profile.username} profile={profile} />
      ))}
    </div>
  );
}
