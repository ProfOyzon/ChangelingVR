'use client';

import { BioSection } from '@/app/_components/dashboard/profile/bio';
import { useProfileQuery } from '@/hooks/use-profile';

export default function GClientPage() {
  const { data, isLoading, error } = useProfileQuery();

  if (isLoading) {
    return <div className="bg-muted h-50 w-full animate-pulse rounded-md"></div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <BioSection profile={data} />
    </div>
  );
}
