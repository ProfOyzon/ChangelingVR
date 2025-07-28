'use client';

import { redirect } from 'next/navigation';
import { AvatarSection } from '@/app/_components/dashboard/settings/avatar';
import { DisplayNameSection } from '@/app/_components/dashboard/settings/display-name';
import { UsernameSection } from '@/app/_components/dashboard/settings/username';
import { useProfileQuery } from '@/hooks/use-profile';

export default function SettingsPage() {
  const { data, isLoading, error } = useProfileQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-muted h-40 w-full animate-pulse rounded-lg" />
        <div className="bg-muted h-40 w-full animate-pulse rounded-lg" />
        <div className="bg-muted h-40 w-full animate-pulse rounded-lg" />
      </div>
    );
  }

  // Error or no data, redirect to login
  if (error || !data) redirect('/auth/login');

  return (
    <div className="flex flex-col gap-6">
      <AvatarSection profile={data} />
      <DisplayNameSection profile={data} />
      <UsernameSection profile={data} />
    </div>
  );
}
