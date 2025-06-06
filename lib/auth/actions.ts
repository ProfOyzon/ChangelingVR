'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { WelcomeEmail } from '@/components/email';
import { validatedAction, validatedActionWithUser } from '@/lib/auth/middleware';
import { comparePassword, hashPassword, setSession } from '@/lib/auth/session';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from '@/lib/auth/validator';
import { db } from '@/lib/db';
import { getUserProfile } from '@/lib/db/queries';
import {
  ActivityType,
  type NewActivityLog,
  type NewMember,
  type NewProfile,
  type Profile,
  activityLogs,
  members,
  profiles,
} from '@/lib/db/schema';
import { sendMail } from '@/lib/nodemailer';
import { eq } from 'drizzle-orm';

async function logActivity(userId: string, type: ActivityType, ipAddress?: string) {
  if (!userId) return;
  if (ipAddress === '::1') return;

  const newActivity: NewActivityLog = {
    uuid: userId,
    action: type,
    ip_address: ipAddress || '',
  };

  await db.insert(activityLogs).values(newActivity);
}

export const login = validatedAction(loginSchema, async (data, formData) => {
  const { email, password, ip } = data;

  // Fetch member by email
  const member = await db.select().from(members).where(eq(members.email, email)).limit(1);
  if (!member || member.length === 0) {
    return { error: 'Invalid email or password.', email, password };
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, member[0].password);
  if (!isPasswordValid) {
    return { error: 'Invalid email or password.', email, password };
  }

  await Promise.all([setSession(member[0]), logActivity(member[0].uuid, ActivityType.SIGN_IN, ip)]);

  // Redirect to dashboard
  redirect('/dashboard');
});

export const register = validatedAction(registerSchema, async (data, formData) => {
  const { email, password, ip } = data;

  const member = await db.select().from(members).where(eq(members.email, email)).limit(1);
  if (member.length > 0) {
    return { error: 'Failed to create user.', email, password };
  }

  // Create new member
  const hashedPassword = await hashPassword(password);
  const newMember: NewMember = {
    email,
    password: hashedPassword,
    created_at: new Date(),
  };

  // Create new member in database
  const newMemberData = await db.insert(members).values(newMember).returning();
  if (!newMemberData || newMemberData.length === 0) {
    return { error: 'Failed to create user.', email, password };
  }

  // Create new profile
  const newProfile: NewProfile = {
    uuid: newMemberData[0].uuid,
    username: email.split('@')[0] + '-' + newMemberData[0].uuid.slice(0, 4),
    terms: [new Date().getFullYear()],
  };

  // Create new profile in database
  const newProfileData = await db.insert(profiles).values(newProfile).returning();
  if (!newProfileData || newProfileData.length === 0) {
    return { error: 'Failed to create profile.', email, password };
  }

  await Promise.all([
    setSession(newMemberData[0]),
    logActivity(newMemberData[0].uuid, ActivityType.SIGN_UP, ip),
    sendMail({
      reciever: email,
      subject: 'Welcome to Changeling VR',
      plainText: "Welcome to Changeling VR! We're excited to have you on board.",
      email: WelcomeEmail({ name: newProfileData[0].username }),
    }),
  ]);

  // Redirect to dashboard
  redirect('/dashboard');
});

export async function logout() {
  const user = (await getUserProfile()) as Profile;
  await logActivity(user.uuid, ActivityType.SIGN_OUT);
  (await cookies()).delete('session');
}

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {},
);

export const forgotPassword = validatedAction(forgotPasswordSchema, async (data, formData) => {});
