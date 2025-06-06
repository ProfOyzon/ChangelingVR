import { createBrowserClient } from '@supabase/ssr';

/**
 * Create a client for the Supabase client
 * Used for client-side actions
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
