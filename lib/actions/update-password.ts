'use server';

import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { logActivity } from '@/lib/actions/log-activity';
import { validatedAction } from '@/lib/auth/middleware';
import { hashPassword } from '@/lib/auth/session';
import { zUpdatePasswordSchema } from '@/lib/auth/validator';
import { db } from '@/lib/db';
import { ActivityType, members, resetTokens } from '@/lib/db/schema';

/**
 * Validates the update password form data and updates the user's password
 */
export const updatePassword = validatedAction(zUpdatePasswordSchema, async (data) => {
  const { token, password } = data;

  // Hash the token and password
  const hashedToken = createHash('sha256').update(token).digest('hex');
  const hashedPassword = await hashPassword(password);

  // Fetch stored token
  const storedToken = await db.query.resetTokens.findFirst({
    where: { token: hashedToken },
    columns: { uuid: true, expiresAt: true },
  });

  // Ensure token exists and is not expired
  if (!storedToken || new Date(storedToken.expiresAt) < new Date()) {
    return { error: '✖ Invalid token or token expired' };
  }

  // Update password and delete token
  await Promise.all([
    db.update(members).set({ password: hashedPassword }).where(eq(members.uuid, storedToken.uuid)),
    db.delete(resetTokens).where(eq(resetTokens.uuid, storedToken.uuid)),
    logActivity(storedToken.uuid, ActivityType.UPDATE_PASSWORD),
  ]);

  // Redirect to login page
  redirect('/auth/login');
});
