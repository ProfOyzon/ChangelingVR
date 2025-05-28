'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Fetches all team profiles from the Supabase 'profiles' table.
 *
 * - Uses the Supabase client to query for username, display name, avatar, bio, terms, teams, roles, and links.
 * - Throws an error if the database query fails.
 * - Returns an array of profile objects or null if no data is found.
 * - Designed for use with React Query or server-side data fetching in Next.js.
 */
export async function fetchProfiles() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url, bio, terms, teams, roles, links');
  if (error) throw error;
  return data;
}
