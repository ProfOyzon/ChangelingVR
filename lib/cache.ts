import { unstable_cache } from 'next/cache';
import type { CachedData } from '../types';
import { createClient } from './supabase/server';

// Cache news data for 1 week since it's rarely updated
export const getCachedNews = unstable_cache(
  async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('news').select('*');

    return {
      status: error ? 500 : 200,
      data: data ?? [],
      cachedAt: new Date().getTime(),
    } as CachedData<typeof data>;
  },
  ['newsz'],
  {
    revalidate: 60 * 60 * 24 * 7, // 1 week
    tags: ['newsz'],
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
  ['charactersz'],
  {
    revalidate: false, // Never revalidate
    tags: ['charactersz'],
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
  ['profilesz'],
  {
    revalidate: 60 * 60 * 1, // 1 hour
    tags: ['profilesz'],
  },
);
