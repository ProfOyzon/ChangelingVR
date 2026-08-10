import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { db } from '@/lib/db';

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

  const data = await db.query.profiles.findMany({
    columns: {
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      terms: true,
      teams: true,
      roles: true,
    },
    with: {
      profileLinks: {
        where: { visible: true },
        columns: { platform: true, url: true },
      },
    },
  });

  return {
    status: 200,
    data,
    cachedAt: new Date().getTime(),
  } as CachedData<typeof data>;
});
