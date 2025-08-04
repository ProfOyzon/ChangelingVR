import { AvatarSection } from '@/app/_components/dashboard/identity/avatar';
import { DisplayNameSection } from '@/app/_components/dashboard/identity/display-name';
import { UsernameSection } from '@/app/_components/dashboard/identity/username';
import { getProfile } from '@/lib/db/queries';
import type { PublicProfile } from '@/lib/db/schema';

export default async function SettingsPage() {
  const profile = (await getProfile()) as PublicProfile;
  if (!profile) return;

  return (
    <div className="flex flex-col gap-6">
      <AvatarSection profile={profile} />
      <DisplayNameSection profile={profile} />
      <UsernameSection profile={profile} />
    </div>
  );
}
