import type { Metadata } from 'next';
import "./username.css"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  // TODO: Fetch the team member data from the database
  // Construct better metadata based on the fetched data

  return {
    title: username,
    description: `User profile for ${username}`,
    openGraph: {
      title: `${username} @ Changeling VR`,
      description: `User profile for ${username}`,
    },
  };
}

export default async function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  // TODO: Fetch the team member data from the database
  // slug === user.username

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <p>Hey,</p>
      <p>{username}</p>
      <div className='container'>
        <div className='user-info'>

        </div>

      </div>

    </div>
  );
}
