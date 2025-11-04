import Image from 'next/image';
import { CopyLink } from '@/components/copy-link';
import { ProfileTab } from '@/components/profile/profile-tab';
import type { FullProfile } from '@/lib/db/schema';
import { SocialLink } from './social-link';

export async function UserProfile({ user }: { user: FullProfile }) {
  'use cache';

  return (
    <article className="bg-dune relative mx-auto flex w-full max-w-4xl flex-col rounded-md p-6 md:flex-row md:gap-6 md:p-12 md:pb-0">
      <aside className="relative flex flex-1 flex-col space-y-6 rounded-t-md bg-slate-500/25 p-6">
        <header className="absolute top-0 left-0 h-40 w-full">
          <Image
            src="/media/background/outside_blurred.webp"
            alt="Profile background"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 896px) 50vw, 448px"
            className="rounded-t-md"
          />

          <CopyLink
            url={`https://changelingvr.com/users/${user.username}`}
            className="absolute top-2 right-2 z-20 flex flex-row items-center gap-2 rounded-md border border-zinc-600/50 bg-zinc-600/50 px-2 py-1.5 text-sm font-medium backdrop-blur-sm hover:cursor-pointer"
          >
            <span>Copy Link</span>
          </CopyLink>
        </header>

        <div className="z-10 space-y-4 pt-10">
          <Image
            src={user.avatarUrl || '/placeholder.png'}
            alt={`${user.displayName || user.username}'s profile picture`}
            width={512}
            height={512}
            className="size-32 rounded-md bg-white shadow-md"
          />

          <header className="flex flex-col">
            <h1 className="text-2xl font-bold">{user.displayName}</h1>
            <p className="text-lg font-light">@{user.username}</p>
          </header>

          {user.links && user.links.length > 0 && (
            <nav className="grid grid-cols-4 gap-2 md:grid-cols-2" aria-label="Social media links">
              {/* Only show visible links */}
              {user.links
                .filter((link) => link.visible)
                .map((link) => (
                  <SocialLink key={link.platform} profile={user} platform={link.platform} />
                ))}
            </nav>
          )}
        </div>
      </aside>

      <section className="flex flex-1 flex-col gap-4 pb-4 max-md:bg-slate-500/25 max-md:p-6 max-md:pt-0">
        <ProfileTab user={user} />
      </section>
    </article>
  );
}
