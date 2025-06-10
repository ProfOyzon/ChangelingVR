import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProfileByUsername } from '@/lib/db/queries';
import './username.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getProfileByUsername(username);

  return {
    title: `${user[0].display_name}`,
    description: `View ${user[0].display_name}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
    openGraph: {
      title: `${user[0].display_name} | Changeling VR`,
      description: `View ${user[0].display_name}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
      images: [
        {
          url: user[0].avatar_url ?? '',
          width: 512,
          height: 512,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${user[0].display_name} | Changeling VR`,
      description: `View ${user[0].display_name}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
      images: [
        {
          url: user[0].avatar_url ?? '',
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
    <div className="flex min-h-[calc(100svh-4rem)] w-screen flex-col items-center justify-center">
      <p>Hey, {user[0].display_name}!</p>
      <div className="container">
        <div className="user-info"></div>
      </div>
    </div>
  );
}
