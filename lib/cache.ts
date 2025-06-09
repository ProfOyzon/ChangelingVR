import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { posts, profiles } from '@/lib/db/schema';
import type { Post } from '@/lib/db/schema';

type CachedData<T> = {
  status: number;
  data: T;
  cachedAt: number;
};

// Cache posts data for 1 week since it's rarely updated
export const getCachedPosts = cache(
  unstable_cache(
    async () => {
      const data = await db
        .select()
        .from(posts)
        .where(eq(posts.published, true))
        .orderBy(desc(posts.id));

      return {
        status: 200,
        data,
        cachedAt: new Date().getTime(),
      } as CachedData<Post[]>;
    },
    ['posts'],
    {
      revalidate: 60 * 60 * 24 * 7, // 1 week
      tags: ['posts'],
    },
  ),
);

export const getCachedUser = cache(
  unstable_cache(
    async () => {
      const data = await db.select().from(profiles);

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
