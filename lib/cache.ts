import { unstable_cache } from 'next/cache';
import type { CachedData } from '../types';
import { createClient } from './supabase/server';

// Cache posts data for 1 week since it's rarely updated
export const getCachedPosts = unstable_cache(
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .filter('published', 'eq', true)
      .order('id', { ascending: false });

    return {
      status: error ? 500 : 200,
      data: data ?? [],
      cachedAt: new Date().getTime(),
    } as CachedData<typeof data>;
  },
  ['posts'],
  {
    revalidate: 60 * 60 * 24 * 7, // 1 week
    tags: ['posts'],
  },
);

// Cache characters data indefinitely since it never changes
export const getCachedCharacters = unstable_cache(
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('characters').select('*');

    return {
      status: error ? 500 : 200,
      data: data ?? [],
      cachedAt: new Date().getTime(),
    } as CachedData<typeof data>;
  },
  ['characters'],
  {
    revalidate: false, // Never revalidate
    tags: ['characters'],
  },
);

export const getCachedUser = unstable_cache(
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('username, display_name, avatar_url, bio, terms, teams, roles, links');

    return {
      status: error ? 500 : 200,
      data: data ?? [],
      cachedAt: new Date().getTime(),
    } as CachedData<typeof data>;
  },
  ['profiles'],
  {
    revalidate: 60 * 60 * 1, // 1 hour
    tags: ['profiles'],
  },
);
