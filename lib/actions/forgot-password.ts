'use server';

import { redirect } from 'next/navigation';
import { createHash, randomUUID } from 'node:crypto';
import PasswordResetEmail from '@/emails/password-reset';
import { sendMail } from '@/emails/transport';
import { validatedAction } from '@/lib/auth/middleware';
import { zForgotPasswordSchema } from '@/lib/auth/validator';
import { db } from '@/lib/db';
import { resetTokens } from '@/lib/db/schema';

/**
 * Validates the forgot password form data and sends a password reset email
 */
export const forgotPassword = validatedAction(zForgotPasswordSchema, async (data) => {
  const member = await db.query.members.findFirst({
    where: { email: data.email },
    columns: { uuid: true, email: true },
    with: { profiles: { columns: { username: true } } },
  });

  if (!member) {
    // Still show success message to prevent account enumeration
    redirect('/auth/forgot-password?success=true');
  }

  const token = randomUUID();
  const hashedToken = createHash('sha256').update(token).digest('hex');
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password?token=${encodeURIComponent(token)}`;

  const TOKEN_TTL_MS = 30 * 60 * 1_000; // 30 minutes

  const userToken = {
    token: hashedToken,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  };

  await db
    .insert(resetTokens)
    .values({
      uuid: member.uuid,
      ...userToken,
    })
    // Update previous token if it exists
    .onConflictDoUpdate({
      target: resetTokens.uuid,
      set: userToken,
    });

  await sendMail({
    to: member.email,
    subject: 'ChangelingVR Password Reset',
    plainText: `Click the link below to reset your password: ${url}`,
    html: PasswordResetEmail({ username: member.profiles[0].username, url }),
  });

  redirect('/auth/forgot-password?success=true');
});
