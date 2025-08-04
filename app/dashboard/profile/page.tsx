import { Suspense } from 'react';
import { BioSection } from '@/app/_components/dashboard/profile/bio';
import { LinkCard } from '@/app/_components/dashboard/profile/link-card';
import { Separator } from '@/components/ui/separator';
import { getFullProfile } from '@/lib/db/queries';
import type { FullProfile } from '@/lib/db/schema';

const PLATFORM_VALUES = ['github', 'linkedin', 'email', 'website'] as const;

export default async function ProfilePage() {
  const profile = (await getFullProfile()) as FullProfile;
  if (!profile) return;

  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<div>Loading...</div>}>
        <BioSection profile={profile} />
      </Suspense>

      <Separator />

      <h1 className="text-2xl font-bold">Social Links</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {PLATFORM_VALUES.map((platform) => {
          const link = profile.links.find((l) => l.platform === platform);
          return <LinkCard key={platform} platform={platform} link={link} />;
        })}
      </Suspense>
    </div>
  );
}
