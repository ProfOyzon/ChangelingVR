import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';

type CachedData<T> = {
  status: number;
  data: T;
  cachedAt: number;
};

export const getCachedUser = cache(
  unstable_cache(
    async () => {
      const data = await db
        .select({
          username: profiles.username,
          display_name: profiles.display_name,
          avatar_url: profiles.avatar_url,
          bio: profiles.bio,
          terms: profiles.terms,
          teams: profiles.teams,
          roles: profiles.roles,
          bg_color: profiles.bg_color,
        })
        .from(profiles);

      return {
        status: 200,
        data,
        cachedAt: new Date().getTime(),
      } as CachedData<typeof data>;
    },
    ['profiles'],
    {
      revalidate: 60 * 60 * 1, // 1 hour
      tags: ['profiles'],
    },
  ),
);
