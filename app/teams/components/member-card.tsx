import Image from 'next/image';
import Link from 'next/link';
import type { Profile } from '@/types';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Globe, Linkedin, Mail } from 'lucide-react';

const LinkIcon = {
  email: <Mail className="size-4" />,
  website: <Globe className="size-4" />,
  github: <SiGithub className="size-4" />,
  linkedin: <Linkedin className="size-4" />,
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
