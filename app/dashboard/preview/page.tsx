import { UserProfile } from '@/app/_components/user-profile';
import { getFullProfile } from '@/lib/db/queries';
import type { FullProfile } from '@/lib/db/schema';

export default async function PreviewPage() {
  const profile = (await getFullProfile()) as FullProfile;
  if (!profile) return;

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 text-gray-100">
      <UserProfile user={profile} />
      <span className="text-sm text-zinc-900">
        *Background is darker when displayed on the site
      </span>
    </div>
  );
}
