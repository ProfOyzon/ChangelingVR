'use client';

import { useRouter } from 'next/navigation';
import { Card, CardAction, CardContent } from '@/components/ui/card';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Globe, Linkedin, Mail } from 'lucide-react';

type TeamMember = {
  username: string;
  display_name: string;
  email?: string;
  bio: string;
  links: string[];
  link_email?: string;
  link_website?: string;
  link_github?: string;
  link_linkedin?: string;
};

type TeamMemberCardProps = {
  member: TeamMember;
  imageUrl: string;
};

const LinkIcon = {
  email: <Mail className="h-5 w-5" />,
  website: <Globe className="h-5 w-5" />,
  github: <SiGithub className="h-5 w-5" />,
  linkedin: <Linkedin className="h-5 w-5" />,
};

export function TeamMemberCard({ member, imageUrl }: TeamMemberCardProps) {
  const router = useRouter();

  const handleProfileClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    router.push(`/users/${member.username}`);
  };

  return (
    <Card
      onClick={handleProfileClick}
      className="relative flex max-h-80 min-h-80 max-w-50 min-w-50 flex-1 cursor-pointer py-0"
    >
      {/* Do not use next/image since it will use up tons of compute available */}
      <img
        src={imageUrl}
        alt={member.username}
        className="h-auto w-full rounded-t-xl mask-b-from-50% object-cover"
        loading="lazy"
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/placeholder.png';
        }}
      />

      {/* Card content */}
      <CardContent className="px-2 pb-2">
        <h2 className="text-lg font-bold">{member.display_name}</h2>
        <p className="line-clamp-3 text-sm text-gray-700">{member.bio}</p>
      </CardContent>

      {/* Card actions */}
      <CardAction className="[&>a]:hover:text-light-mustard absolute top-2 right-2 z-5 flex flex-col items-center gap-1 [&>a]:rounded [&>a]:bg-gray-800/80 [&>a]:p-1 [&>a]:text-white">
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
      </CardAction>
    </Card>
  );
}
