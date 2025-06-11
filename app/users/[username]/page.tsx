import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProfileByUsername } from '@/lib/db/queries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getProfileByUsername(username);

  return {
    title: user[0].username,
    description: `View ${user[0].display_name || user[0].username}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
    openGraph: {
      title: `${user[0].username} | Changeling VR`,
      description: `View ${user[0].display_name || user[0].username}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
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
      title: `${user[0].username} | Changeling VR`,
      description: `View ${user[0].display_name || user[0].username}'s profile on Changeling VR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
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
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="relative flex h-2/3 w-2/4 flex-col items-stretch rounded-2xl border border-gray-600 bg-[#0b0d15] shadow-xl">
        <div className="h-1/4 rounded-t-2xl bg-gray-400"></div>

        <div className="flex h-3/4 flex-col-reverse gap-10 rounded-b-2xl bg-white p-4">
          <div className="h-4/5 overflow-auto rounded-md bg-sky-300 p-4 text-2xl">
            {user[0].bio}
          </div>

          <div className="flex items-center gap-4 self-center rounded-md bg-amber-300 px-4 py-2">
            <span className="font-semibold text-black">{user[0].username}</span>
            <div className="flex flex-wrap gap-2">
              {user[0].roles?.map((role, index) => (
                <span
                  key={index}
                  className="rounded-full bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute top-1/16 left-0 h-35 w-35 translate-x-2.5 translate-y-1/2 overflow-hidden rounded-full border border-gray-400 bg-gray-200 shadow-md">
            <img
              src={user[0].avatar_url || 'https://via.placeholder.com/56'}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
