import { RolesSection } from '@/app/_components/dashboard/assignments/roles';
import { TeamsSection } from '@/app/_components/dashboard/assignments/teams';
import { TermsSection } from '@/app/_components/dashboard/assignments/term';
import { getProfile } from '@/lib/db/queries';
import type { PublicProfile } from '@/lib/db/schema';

export default async function AssignmentsPage() {
  const profile = (await getProfile()) as PublicProfile;
  if (!profile) return;

  return (
    <div className="flex flex-col gap-6">
      <TermsSection profile={profile} />
      <RolesSection profile={profile} />
      <TeamsSection profile={profile} />
    </div>
  );
}
