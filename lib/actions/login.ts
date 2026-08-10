'use server';

import { redirect } from 'next/navigation';
import { logActivity } from '@/lib/actions/log-activity';
import { validatedAction } from '@/lib/auth/middleware';
import { comparePassword, setSession } from '@/lib/auth/session';
import { zLoginSchema } from '@/lib/auth/validator';
import { db } from '@/lib/db';
import { ActivityType } from '@/lib/db/schema';

/**
 * Validates the login form data and logs the user in
 */
export const login = validatedAction(zLoginSchema, async (data) => {
  const { email, password } = data;

  // Fetch member by email
  const member = await db.query.members.findFirst({
    where: { email: email },
    columns: { uuid: true, password: true },
  });

  // Member not found, redirect back with error
  if (!member) {
    return { error: '✖ Invalid email or password.', email };
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, member.password);
  if (!isPasswordValid) {
    return { error: '✖ Invalid email or password.', email };
  }

  // Set session and log activity
  await Promise.all([setSession(member.uuid), logActivity(member.uuid, ActivityType.SIGN_IN)]);

  // Redirect to dashboard
  redirect('/dashboard/profile');
});
