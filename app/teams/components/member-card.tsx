import { FaGithub, FaGlobe, FaLinkedin, FaRegEnvelope } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import type { Profile, ProfileLink } from '@/lib/db/schema';

const LinkIcon = {
  email: <FaRegEnvelope className="size-4" />,
  website: <FaGlobe className="size-4" />,
  github: <FaGithub className="size-4" />,
  linkedin: <FaLinkedin className="size-4" />,
};

export function TeamMemberCard({ member }: { member: Profile & { links: ProfileLink[] } }) {
  return (
    <div className="bg-steel/50 hover:bg-steel/75 relative flex h-64 w-40 max-w-40 min-w-40 flex-1 flex-col rounded backdrop-blur-sm transition-colors duration-300">
      <Link href={`/users/${member.username}`} className="flex h-full cursor-pointer flex-col">
        <Image
          src={member.avatar_url || '/placeholder.png'}
          alt={member.username}
          width={128}
          height={128}
          className="w-full rounded-t-xl mask-b-from-50% object-cover"
          loading="lazy"
        />

        <div className="w-full space-y-1 p-2">
          <span className="line-clamp-1 text-lg font-bold">
            {member.display_name || `@${member.username}`}
          </span>
          <span className="line-clamp-3 text-xs text-gray-300">
            {member.bio || 'No bio available'}
          </span>
        </div>
      </Link>

      <div className="[&>a]:hover:text-light-mustard absolute top-2 right-2 z-10 flex flex-col items-center gap-1 [&>a]:rounded [&>a]:bg-gray-800/80 [&>a]:p-1 [&>a]:text-white">
        {member.links.map((link) => {
          const icon = LinkIcon[link.platform as keyof typeof LinkIcon];
          return (
            <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer">
              {icon}
            </a>
          );
        })}
      </div>
    </div>
  );
}
