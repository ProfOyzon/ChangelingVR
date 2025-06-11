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
  <div className="relative flex flex-col w-2/4 h-2/3 bg-[#0b0d15] items-stretch border border-gray-600 shadow-xl rounded-2xl">

    <div className="bg-gray-400 h-1/4 rounded-t-2xl"></div>

    <div className="flex flex-col-reverse h-3/4 bg-white gap-10 rounded-b-2xl p-4">
      <div className="h-4/5 bg-sky-300 text-2xl rounded-md p-4 overflow-auto">
        {user[0].bio}
      </div>

      <div className="bg-amber-300 self-center px-4 py-2 rounded-md flex items-center gap-4">
        <span className="font-semibold text-black">{user[0].username}</span>
        <div className="flex gap-2 flex-wrap">
          {user[0].roles.map((role, index) => (
            <span
              key={index}
              className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2 py-1 rounded-full"
            >
              {role}
            </span>
          ))}
        </div>
      </div>

           <div className="absolute left-0 top-1/16 translate-x-1.5 translate-y-1/2 w-40 h-40 rounded-full bg-gray-200 overflow-hidden border border-gray-400 shadow-md">
          <img
            src={user[0].avatar_url || 'https://via.placeholder.com/56'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
    </div>

  </div>
</div>

  );
}
