'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { logActivity } from '@/lib/actions/log-activity';
import { getProfile } from '@/lib/db/queries';
import { ActivityType } from '@/lib/db/schema';

/**
 * Logs the user out and redirects to the home page
 */
export async function logout() {
  const user = await getProfile();
  if (user) {
    // Log the SIGN_OUT activity if user exists (should always exist)
    await logActivity(user.uuid, ActivityType.SIGN_OUT);
  }

  (await cookies()).delete('session');
  redirect('/auth/login');
}
