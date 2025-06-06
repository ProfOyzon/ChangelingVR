'use server';

import { db } from '@/lib/db';
import { profileLinks, profiles } from '@/lib/db/schema';

/**
 * Fetches all team profiles from the Supabase 'profiles' table.
 *
 * - Uses the Supabase client to query for username, display name, avatar, bio, terms, teams, roles, and links.
 * - Throws an error if the database query fails.
 * - Returns an array of profile objects or null if no data is found.
 * - Designed for use with React Query or server-side data fetching in Next.js.
 */
export async function fetchProfiles() {
  const data = await db.select().from(profiles);
  const links = await db.select().from(profileLinks);
  if (!data) throw new Error('Failed to fetch profiles');

  const enhancedData = data.map((profile) => ({
    ...profile,
    links: links.filter((link) => link.uuid === profile.uuid),
  }));

  return enhancedData;
}
