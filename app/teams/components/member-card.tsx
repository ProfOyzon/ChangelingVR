import { FaGithub, FaGlobe, FaLinkedin, FaRegEnvelope } from 'react-icons/fa6';
import Image from 'next/image';
import Link from 'next/link';
import type { Profile } from '@/types';

const LinkIcon = {
  email: <FaRegEnvelope className="size-4" />,
  website: <FaGlobe className="size-4" />,
  github: <FaGithub className="size-4" />,
  linkedin: <FaLinkedin className="size-4" />,
};

export function TeamMemberCard({ member }: { member: Profile }) {
  return (
    <div className="relative flex flex-col w-40 min-w-40 max-w-40 h-64 flex-1 bg-steel/50 backdrop-blur-sm rounded hover:bg-steel/75 transition-colors duration-300">
      <Link href={`/users/${member.username}`} className="flex flex-col h-full cursor-pointer">
        {/* Do not use next/image since it will use up tons of compute available */}
        <Image
          src={member.avatar_url || '/placeholder.png'}
          alt={member.username}
          width={128}
          height={128}
          className=" w-full rounded-t-xl mask-b-from-50% object-cover"
          loading="lazy"
        />

        {/* Card content */}
        <div className="p-2 w-full space-y-1">
          <span className="text-lg line-clamp-1 font-bold">
            {member.display_name || `@${member.username}`}
          </span>
          <span className="line-clamp-3 text-xs text-gray-300">
            {member.bio || 'No bio available'}
          </span>
        </div>
      </Link>

      <div className="[&>a]:hover:text-light-mustard absolute top-2 right-2 z-10 flex flex-col items-center gap-1 [&>a]:rounded [&>a]:bg-gray-800/80 [&>a]:p-1 [&>a]:text-white">
        {Object.entries(member.links).map(([key, value]) => {
          const icon = LinkIcon[key as keyof typeof LinkIcon];
          if (value && icon) {
            return (
              <a
                key={key}
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {icon}
              </a>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
