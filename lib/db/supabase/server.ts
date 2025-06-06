import { createServerClient } from '@supabase/ssr';

/**
 * Create a client for the Supabase server
 * Used for server-side actions
 */
export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // No-op
        },
      },
    },
  );
}
