'use client';

import { RolesSection } from '@/app/_components/dashboard/assignments/roles';
import { TeamsSection } from '@/app/_components/dashboard/assignments/teams';
import { TermsSection } from '@/app/_components/dashboard/assignments/term';
import { useProfileQuery } from '@/hooks/use-profile';

export default function EPage() {
  const { data, isLoading, error } = useProfileQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <TermsSection profile={data} />
      <RolesSection profile={data} />
      <TeamsSection profile={data} />
    </div>
  );
}
