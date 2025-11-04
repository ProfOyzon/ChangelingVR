import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';

type CachedData<T> = {
  status: number;
  data: T;
  cachedAt: number;
};

/**
 * Gets the cached users from the database
 * @returns {CachedData<typeof data>} The cached users
 */
export const getCachedUsers = cache(async () => {
  'use cache';
  cacheTag('users');
  cacheLife('hours');

  const data = await db
    .select({
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
      bio: profiles.bio,
      terms: profiles.terms,
      teams: profiles.teams,
      roles: profiles.roles,
      bgColor: profiles.bgColor,
    })
    .from(profiles);

  return {
    status: 200,
    data,
    cachedAt: new Date().getTime(),
  } as CachedData<typeof data>;
});
