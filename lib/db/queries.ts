'use server';

import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';
import { activityLogs, members, profileLinks, profiles, resetTokens } from './schema';

export async function getUserMember() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (!sessionData || !sessionData.user || typeof sessionData.user.id !== 'string') {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(members)
    .where(eq(members.uuid, sessionData.user.id))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getUserProfile() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (!sessionData || !sessionData.user || typeof sessionData.user.id !== 'string') {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.uuid, sessionData.user.id))
    .limit(1);

  if (profile.length === 0) {
    return null;
  }

  return profile[0];
}

export async function getUserProfileWithLinks() {
  const profile = await getUserProfile();
  if (!profile) {
    return null;
  }

  const links = await db.select().from(profileLinks).where(eq(profileLinks.uuid, profile.uuid));

  return {
    ...profile,
    links,
  };
}

export async function getActivityLogs() {
  const user = await getUserProfile();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ip_address: activityLogs.ip_address,
    })
    .from(activityLogs)
    .leftJoin(members, eq(activityLogs.uuid, members.uuid))
    .where(eq(activityLogs.uuid, user.uuid))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getResetToken(uuid: string) {
  return await db.select().from(resetTokens).where(eq(resetTokens.uuid, uuid)).limit(1);
}
