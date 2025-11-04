import type { ReactNode } from 'react';
import {
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from 'react-icons/fa6';
import type { FullProfile } from '@/lib/db/schema';

const iconMap: Record<string, ReactNode> = {
  github: <FaGithub className="size-6" />,
  linkedin: <FaLinkedin className="size-6" />,
  email: <FaEnvelope className="size-6" />,
  website: <FaGlobe className="size-6" />,
  x: <FaXTwitter className="size-6" />,
  instagram: <FaInstagram className="size-6" />,
};

export function SocialLink({ profile, platform }: { profile: FullProfile; platform: string }) {
  const link = profile.links.find((link) => link.platform === platform);
  if (!link) return null;

  const isEmail = platform === 'email';

  return (
    <a
      href={isEmail ? `mailto:${link.url}` : link.url}
      target={isEmail ? undefined : '_blank'}
      rel={isEmail ? undefined : 'noopener noreferrer'}
      className="flex flex-1 flex-col items-center justify-center rounded-md bg-zinc-900/50 p-2 transition-colors hover:bg-zinc-900/75"
      aria-label={
        isEmail
          ? `Send email to ${profile.displayName || profile.username}`
          : `Visit ${profile.displayName || profile.username}'s ${link.platform} profile`
      }
    >
      <span className="flex flex-row items-center justify-center gap-2">
        {iconMap[link.platform]}
        <span className="hidden capitalize md:block">{link.platform}</span>
      </span>
    </a>
  );
}
