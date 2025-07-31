import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UserProfile } from '@/components/user-profile';
import { getProfileByUsername } from '@/lib/db/queries';
import type { FullProfile } from '@/lib/db/schema';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) return notFound();

  return {
    title: user.username,
    description: `View ${user.display_name || user.username}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
    openGraph: {
      title: `${user.username} | Changeling VR`,
      description: `View ${user.display_name || user.username}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
      images: [
        {
          url: user.avatar_url ?? '',
          width: 512,
          height: 512,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${user.username} | Changeling VR`,
      description: `View ${user.display_name || user.username}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
      images: [
        {
          url: user.avatar_url ?? '',
          width: 512,
          height: 512,
        },
      ],
    },
  };
}

export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) return notFound();

  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center p-6">
      <UserProfile user={user as FullProfile} />
    </div>
  );
}
