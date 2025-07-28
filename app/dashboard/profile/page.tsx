import { LinkCard } from '@/app/_components/dashboard/profile/link-card';
import { Separator } from '@/components/ui/separator';
import { getProfileLinks } from '@/lib/db/queries';
import type { ProfileLink } from '@/lib/db/schema';
import GClientPage from './page.client';

const PLATFORM_VALUES = ['github', 'linkedin', 'email', 'website'] as const;

export default async function GPage() {
  const links = await getProfileLinks();

  return (
    <div className="flex flex-col gap-6">
      <GClientPage />
      <Separator />
      <h1 className="text-2xl font-bold">Social Links</h1>
      {PLATFORM_VALUES.map((platform) => {
        const link = links.find((l) => l.platform === platform);
        return <LinkCard key={platform} platform={platform} link={link as ProfileLink} />;
      })}
    </div>
  );
}
