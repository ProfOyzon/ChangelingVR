'use server';

import { redirect } from 'next/navigation';
import { sendMail } from '@/emails/transport';
import WelcomeEmail from '@/emails/welcome';
import { logActivity } from '@/lib/actions/log-activity';
import { validatedAction } from '@/lib/auth/middleware';
import { hashPassword, setSession } from '@/lib/auth/session';
import { zRegisterSchema } from '@/lib/auth/validator';
import { db } from '@/lib/db';
import { ActivityType, members, profiles } from '@/lib/db/schema';

/**
 * Validates the register form data and creates a new user
 */
export const register = validatedAction(zRegisterSchema, async (data) => {
  const { email, password } = data;

  // Check if member already exists
  const member = await db.query.members.findFirst({
    where: { email: email },
    columns: { uuid: true },
  });

  // Member already exists, redirect back with error
  if (member) {
    return { error: '✖ Failed to create user', email };
  }

  // Create new member in database
  const hashedPassword = await hashPassword(password);
  const newMember = await db
    .insert(members)
    .values({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })
    .returning({ uuid: members.uuid });

  if (newMember.length === 0) {
    return { error: '✖ Failed to create user', email };
  }

  // Create new profile in database
  const generatedUsername = email.split('@')[0] + '-' + newMember[0].uuid.slice(0, 4);
  const newProfile = await db
    .insert(profiles)
    .values({
      uuid: newMember[0].uuid,
      username: generatedUsername,
      terms: [new Date().getFullYear()],
    })
    .returning({ username: profiles.username });

  if (newProfile.length === 0) {
    return { error: '✖ Failed to create profile', email };
  }

  // Set session, log activity, and send welcome email
  await Promise.all([
    setSession(newMember[0].uuid),
    logActivity(newMember[0].uuid, ActivityType.SIGN_UP),
    sendMail({
      to: email,
      subject: 'Welcome to ChangelingVR',
      plainText: "Welcome to ChangelingVR! We're excited to have you on board.",
      html: WelcomeEmail({ name: newProfile[0].username }),
    }),
  ]);

  // Redirect to dashboard
  redirect('/dashboard');
});
