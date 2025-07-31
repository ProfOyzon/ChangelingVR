import { UserProfile } from '@/components/user-profile';
import { getProfileLinks, getUserProfile } from '@/lib/db/queries';
import type { FullProfile, Profile, ProfileLink } from '@/lib/db/schema';

export default async function PreviewPage() {
  const [user, links] = await Promise.all([
    getUserProfile() as Promise<Profile | null>,
    getProfileLinks() as Promise<ProfileLink[] | null>,
  ]);

  if (!user || !links) {
    return <div>User not found</div>;
  }

  const profile = {
    ...user,
    links: links,
  } as FullProfile;

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 text-gray-100">
      <UserProfile user={profile} />
      <span className="text-sm text-zinc-900">
        *Background is darker when displayed on the site
      </span>
    </div>
  );
}
