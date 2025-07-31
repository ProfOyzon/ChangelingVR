import { FaEnvelope, FaGithub, FaGlobe, FaLinkedin } from 'react-icons/fa6';
import Image from 'next/image';
import { CopyLink } from '@/components/copy-link';
import type { FullProfile, Profile, ProfileLink } from '@/lib/db/schema';

const iconMap: Record<string, React.ReactNode> = {
  github: <FaGithub className="size-6" />,
  linkedin: <FaLinkedin className="size-6" />,
  email: <FaEnvelope className="size-6" />,
  website: <FaGlobe className="size-6" />,
};

export function UserProfile({ user }: { user: FullProfile }) {
  return (
    <article className="bg-dune mx-auto flex w-full max-w-4xl flex-col rounded-md p-6 md:flex-row md:gap-6 md:p-12 md:pb-0">
      <aside className="relative flex flex-1 flex-col space-y-6 rounded-t-md bg-zinc-600/50 p-6 pt-20">
        <header className="absolute top-0 left-0 h-40 w-full">
          <Image
            src="/background/outside_blurred.webp"
            alt="Profile background"
            fill
            className="rounded-t-md"
          />

          <div className="absolute top-2 right-2 rounded-md bg-zinc-600/50 px-2 py-1.5">
            <CopyLink
              url={`https://changelingvr.com/users/${user.username}`}
              className="flex flex-row items-center gap-2 text-sm font-medium"
            >
              <p>Copy Link</p>
            </CopyLink>
          </div>
        </header>

        <figure className="z-10">
          <Image
            src={user.avatar_url || '/placeholder.png'}
            alt={`${user.display_name || user.username}'s profile picture`}
            width={512}
            height={512}
            className="size-32 rounded-md"
          />
        </figure>

        <header className="flex flex-col">
          <h1 className="text-2xl font-bold">{user.display_name}</h1>
          <p className="text-lg font-light">@{user.username}</p>
        </header>

        {user.links && user.links.length > 0 && (
          <nav
            className="grid flex-1 grid-cols-4 gap-2 md:grid-cols-2"
            aria-label="Social media links"
          >
            {user.links.map((link) => (
              <SocialLink
                key={link.platform}
                link={link as ProfileLink}
                user={user as unknown as Profile}
              />
            ))}
          </nav>
        )}
      </aside>

      <section className="flex flex-1 flex-col gap-4 max-md:bg-zinc-600/50 max-md:p-6 max-md:pt-0">
        {user.bio && (
          <section>
            <h2 className="sr-only">Biography</h2>
            <p>{user.bio}</p>
          </section>
        )}

        {user.terms && user.terms.length > 0 && (
          <section>
            <h2 className="mb-2 text-lg font-semibold">Term{user.terms.length > 1 ? 's' : ''}</h2>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Terms participated in">
              {user.terms.map((term) => (
                <Badge key={term} role="listitem">
                  {term}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {user.roles && user.roles.length > 0 && (
          <section>
            <h2 className="mb-2 text-lg font-semibold">Role{user.roles.length > 1 ? 's' : ''}</h2>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Roles in the project">
              {user.roles.map((role) => (
                <Badge key={role} role="listitem">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {user.teams && user.teams.length > 0 && (
          <section>
            <h2 className="mb-2 text-lg font-semibold">Team{user.teams.length > 1 ? 's' : ''}</h2>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Teams participated in">
              {user.teams.map((team) => (
                <Badge key={team} role="listitem">
                  {team.charAt(0).toUpperCase() + team.slice(1)}
                </Badge>
              ))}
            </div>
          </section>
        )}
      </section>
    </article>
  );
}

function SocialLink({ link, user }: { link: ProfileLink; user: Profile }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-1 flex-col items-center justify-center rounded-md bg-zinc-900/50 p-2 transition-colors hover:bg-zinc-900/75"
      aria-label={`Visit ${user.display_name || user.username}'s ${link.platform} profile`}
    >
      <span className="flex flex-row items-center justify-center gap-2">
        {iconMap[link.platform]}
        <span className="hidden md:block">
          {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
        </span>
      </span>
    </a>
  );
}

function Badge({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-black" {...props}>
      {children}
    </span>
  );
}
