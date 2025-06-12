import { FaGithub, FaGlobe, FaLinkedin, FaRegEnvelope } from 'react-icons/fa6';
import Image from 'next/image';
import { getProfileLinks, getUserProfile } from '@/lib/db/queries';
import type { Profile, ProfileLink } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

const LinkIcon = {
  email: <FaRegEnvelope className="size-4" />,
  website: <FaGlobe className="size-4" />,
  github: <FaGithub className="size-4" />,
  linkedin: <FaLinkedin className="size-4" />,
};

export default async function PreviewPage() {
  const user = (await getUserProfile()) as Profile;
  const links = (await getProfileLinks()) as ProfileLink[];

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={cn(
          'w-full space-y-4 text-black',
          user.bio && user.bio.length >= 250 ? 'max-w-2xl' : 'max-w-xl',
        )}
      >
        <div className="bg-steel/50 rounded shadow-lg backdrop-blur-sm">
          <div className="relative h-32 w-full rounded-t bg-gradient-to-r from-indigo-500 to-indigo-600">
            <div className="absolute -bottom-6 left-6 flex items-end gap-2">
              <div className="relative h-24 w-24 overflow-hidden rounded bg-white shadow-lg">
                <Image
                  src={user.avatar_url ?? '/placeholder.png'}
                  alt={user.display_name || user.username}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                  {user.display_name || user.username}
                </h1>
                <p className="text-black">@{user.username}</p>
              </div>
            </div>
          </div>

          <div className="relative px-6 pt-12 pb-6">
            {links.filter((link) => link.visible).length > 0 && (
              <div className="bg-steel/50 absolute top-2 right-2 flex justify-center gap-2 rounded px-2 py-1 shadow backdrop-blur-sm">
                {links.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-light-mustard transition-colors duration-150"
                  >
                    {LinkIcon[link.platform as keyof typeof LinkIcon]}
                  </a>
                ))}
              </div>
            )}

            {user.bio && <p className="mb-6 min-h-24 leading-relaxed">{user.bio}</p>}

            <div className="grid grid-cols-3 gap-4">
              {user.terms && user.terms.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium">Terms</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {user.terms.map((term) => (
                      <span
                        key={term}
                        className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-sm text-indigo-500"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.teams && user.teams.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium">Teams</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {user.teams.map((team) => (
                      <span
                        key={team}
                        className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-sm text-emerald-500"
                      >
                        {team}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.roles && user.roles.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium">Roles</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-sm text-amber-500"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
