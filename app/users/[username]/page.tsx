import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { UserProfile } from '@/components/profile/user-profile';
import { getProfileByUsername, getUsernames } from '@/lib/db/queries';

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
    description: `View ${user.displayName || user.username}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
    openGraph: {
      title: `${user.username} | Changeling VR`,
      description: `View ${user.displayName || user.username}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
    },
    twitter: {
      card: 'summary',
      title: `${user.username} | Changeling VR`,
      description: `View ${user.displayName || user.username}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
    },
  };
}

export async function generateStaticParams() {
  const usernames = await getUsernames();
  return usernames.map((username) => ({ username }));
}

export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) return notFound();

  return (
    <div className="relative flex min-h-[calc(100vh-10rem)] w-full items-center justify-center p-6">
      <UserProfile user={user} />
      <div className="absolute top-4 left-4">
        <Link
          href="/teams"
          className="bg-light-mustard text-midnight hover:bg-steel flex items-center rounded px-2 py-1 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Teams
        </Link>
      </div>
    </div>
  );
}
