'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
} from '@/app/(dev)/auth/schemas';
import { WelcomeEmail } from '@/components/email';
import { validatedAction, validatedActionWithUser } from '@/lib/auth/middleware';
import { comparePassword, hashPassword, setSession } from '@/lib/auth/session';
import { getUserProfile } from '@/lib/db/queries';
import { ActivityType } from '@/lib/db/schema';
import { sendMail } from '@/lib/send-mail';
import { createClient } from '@/lib/supabase/server';
import type { Member } from '@/types';

async function logActivity(userId: string, type: ActivityType, ipAddress?: string) {
  if (!userId) return;
  if (ipAddress === '::1') return;

  const newActivity = {
    uuid: userId,
    action: type,
    ip_address: ipAddress || '',
  };

  const supabase = createClient();
  await supabase.from('activity_logs').insert(newActivity);
}

export const login = validatedAction(loginSchema, async (data, formData) => {
  const { email, password, ip } = data;

  // Fetch member by email
  const supabase = createClient();
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('*')
    .eq('email', email)
    .single();

  if (!member || memberError) {
    return { error: 'Invalid email or password.', email, password };
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, member.password);
  if (!isPasswordValid) {
    return { error: 'Invalid email or password.', email, password };
  }

  await Promise.all([setSession(member), logActivity(member.uuid, ActivityType.SIGN_IN, ip)]);

  // Redirect to dashboard
  redirect('/dashboard');
});

export const register = validatedAction(registerSchema, async (data, formData) => {
  const { email, password, ip } = data;
  const supabase = createClient();

  // Check if user already exists
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('uuid')
    .eq('email', email)
    .single();

  if (member || memberError) {
    return { error: 'Failed to create user.', email, password };
  }

  // Create new member
  const hashedPassword = await hashPassword(password);
  const newMember = {
    email,
    password: hashedPassword,
  };

  // Create new member in database
  const { data: newMemberData, error: newMemberError } = await supabase
    .from('members')
    .insert(newMember)
    .select();

  if (!newMemberData || !newMemberData[0] || newMemberError) {
    return { error: 'Failed to create user.', email, password };
  }

  // Create new profile
  const newProfile = {
    uuid: newMemberData[0].uuid,
    username: email.split('@')[0] + '-' + newMemberData[0].uuid.slice(0, 4),
    terms: [new Date().getFullYear()],
  };

  // Create new profile in database
  const { data: newProfileData, error: newProfileError } = await supabase
    .from('profiles')
    .insert(newProfile)
    .select();

  if (!newProfileData || newProfileError) {
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
  const user = (await getUserProfile()) as Member;
  await logActivity(user.uuid, ActivityType.SIGN_OUT);
  (await cookies()).delete('session');
}

export const updatePassword = validatedActionWithUser(
  updatePasswordSchema,
  async (data, _, user) => {},
);

export const forgotPassword = validatedAction(forgotPasswordSchema, async (data, formData) => {});
