import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { PublicProfile } from '@/lib/db/schema';

export const ProfileCard = memo(ProfileCardComponent);

function ProfileCardComponent({ profile }: { profile: PublicProfile }) {
  return (
    <div className="bg-steel/50 hover:bg-steel/75 relative flex h-64 w-40 max-w-40 min-w-40 flex-1 flex-col rounded-md backdrop-blur-sm transition-colors duration-300">
      <Link href={`/users/${profile.username}`} className="flex h-full cursor-pointer flex-col">
        <Image
          src={profile.avatar_url || '/placeholder.png'}
          alt={profile.username}
          width={128}
          height={128}
          className="w-full rounded-t-md mask-b-from-50% object-cover"
          loading="lazy"
        />

        <div className="w-full space-y-1 p-2">
          <span className="line-clamp-1 text-base font-bold">
            {profile.display_name || `@${profile.username}`}
          </span>
          <span className="line-clamp-3 text-xs text-gray-300">
            {profile.bio || 'No bio available'}
          </span>
        </div>
      </Link>
    </div>
  );
}
