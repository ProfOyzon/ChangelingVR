import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import type { Person, ProfilePage, WithContext } from 'schema-dts';
import { UserProfile } from '@/components/profile/user-profile';
import { getProfileByUsername, getUsernames } from '@/lib/db/queries';
import { FullProfile } from '@/lib/db/schema';
import { stringifyMarkdown } from '@/lib/utils';

export async function generateStaticParams() {
  return await getUsernames();
}

export async function generateMetadata(props: PageProps<'/users/[username]'>): Promise<Metadata> {
  const { username } = await props.params;
  const user = await getProfileByUsername(username);
  if (!user) return notFound();

  return {
    title: user.displayName || user.username,
    description: `View ${user.displayName || user.username}'s profile on ChangelingVR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
    openGraph: {
      title: `${user.username} | ChangelingVR`,
      description: `View ${user.displayName || user.username}'s profile on ChangelingVR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${user.username} | ChangelingVR`,
      description: `View ${user.displayName || user.username}'s profile on ChangelingVR - Explore their contributions, activity, and role in the development of our immersive VR experience.`,
    },
  };
}

export default function Page(props: PageProps<'/users/[username]'>) {
  return (
    <div className="relative flex min-h-[calc(100svh-4rem)] w-full items-center justify-center p-6">
      <Suspense fallback={<Skeleton />}>
        <UserContent params={props.params} />
      </Suspense>
      <button aria-label="Back to Teams" className="absolute top-6 left-6">
        <Link
          href="/teams"
          className="bg-light-mustard text-midnight hover:bg-steel flex items-center rounded px-2 py-1 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Teams
        </Link>
      </button>
    </div>
  );
}

async function UserContent({ params }: { params: PageProps<'/users/[username]'>['params'] }) {
  const { username } = await params;
  if (!username) return notFound();
  const user = (await getProfileByUsername(username)) as FullProfile;
  if (!user) return notFound();

  const profileUrl = `https://changelingvr.com/users/${encodeURIComponent(user.username)}`;
  const sameAs = user.profileLinks?.filter((l) => l.url.startsWith('http')).map((l) => l.url);
  const jobTitle = user.roles?.map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(', ');

  const person: Person = {
    '@type': 'Person',
    '@id': `${profileUrl}#person`,
    name: user.displayName || user.username,
    alternateName: user.username,
    url: profileUrl,
    mainEntityOfPage: profileUrl,
    ...(user.bio ? { description: stringifyMarkdown(user.bio) } : {}),
    ...(user.avatarUrl ? { image: user.avatarUrl } : {}),
    ...(jobTitle ? { jobTitle } : {}),
    worksFor: {
      '@type': 'Organization',
      name: 'ChangelingVR',
      url: 'https://changelingvr.com',
    },
    affiliation: {
      '@type': 'Organization',
      name: 'Rochester Institute of Technology',
      url: 'https://www.rit.edu/',
    },
    ...(sameAs?.length ? { sameAs } : {}),
  };

  const jsonLd: WithContext<ProfilePage> = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: person,
    dateCreated: user.member.createdAt.toISOString(),
    // The db currently does not track updates
    // dateModified: user.member.updatedAt.toISOString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replaceAll('<', '\\u003c'),
        }}
      />
      <UserProfile user={user} />
    </>
  );
}

async function Skeleton() {
  return <div className="h-100 w-full max-w-4xl animate-pulse rounded-md bg-gray-700" />;
}
