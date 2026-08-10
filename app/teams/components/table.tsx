import { ProfileCard } from '@/app/teams/components/profile-card';
import { getFilteredProfiles } from '@/lib/db/queries';
import type { FullProfile } from '@/lib/db/schema';

export function TableSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-4">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="h-64 w-40 animate-pulse rounded-md bg-gray-700" />
      ))}
    </div>
  );
}

export async function Table({ query, page }: { query: string; page: string }) {
  const profiles = (await getFilteredProfiles(query, Number(page))) as FullProfile[];

  if (!profiles || profiles.length === 0) {
    return (
      <div className="mx-auto flex flex-col flex-wrap items-center">
        <p className="text-gray-300">No matching profiles for</p>
        <span className="text-gray-400">&ldquo;{query}&rdquo;</span>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-center gap-4">
      {profiles.map((profile) => (
        <ProfileCard key={profile.username} profile={profile} />
      ))}
    </div>
  );
}
