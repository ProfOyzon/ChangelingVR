'use server';

import { cookies } from 'next/headers';
import { desc, eq } from 'drizzle-orm';
import { verifyToken } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { activityLogs, members, profileLinks, profiles, resetTokens } from './schema';

// Fetches member table; requires session cookie
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

// Fetches profile table; requires session cookie
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

// Fetches profile links table; requires session cookie
export async function getProfileLinks() {
  const user = await getUserProfile();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      platform: profileLinks.platform,
      url: profileLinks.url,
      visible: profileLinks.visible,
    })
    .from(profileLinks)
    .where(eq(profileLinks.uuid, user.uuid));
}

// Fetches activity logs table; requires session cookie
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
      user_agent: activityLogs.user_agent,
      country: activityLogs.country,
      country_code: activityLogs.country_code,
      region: activityLogs.region,
      city: activityLogs.city,
      latitude: activityLogs.latitude,
      longitude: activityLogs.longitude,
      zip: activityLogs.zip,
    })
    .from(activityLogs)
    .leftJoin(members, eq(activityLogs.uuid, members.uuid))
    .where(eq(activityLogs.uuid, user.uuid))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

// Fetches reset token that matches the UUID
export async function getResetToken(uuid: string) {
  return await db
    .select({ token: resetTokens.token, expires_at: resetTokens.expires_at })
    .from(resetTokens)
    .where(eq(resetTokens.uuid, uuid))
    .limit(1);
}

// Fetches profile by username
export async function getProfileByUsername(username: string) {
  // To secure profile from username fetches, we do not return the UUID
  const profile = await db
    .select({
      display_name: profiles.display_name,
      username: profiles.username,
      avatar_url: profiles.avatar_url,
      bio: profiles.bio,
      terms: profiles.terms,
      teams: profiles.teams,
      roles: profiles.roles,
      bg_color: profiles.bg_color,
    })
    .from(profiles)
    .where(eq(profiles.username, username))
    .limit(1);

  if (profile.length === 0) {
    return null;
  }

  return profile[0];
}

// Fetches complete profiles table
export async function getCompleteProfiles() {
  const profilesData = await db
    .select({
      uuid: profiles.uuid,
      username: profiles.username,
      display_name: profiles.display_name,
      avatar_url: profiles.avatar_url,
      bio: profiles.bio,
      terms: profiles.terms,
      teams: profiles.teams,
      roles: profiles.roles,
      bg_color: profiles.bg_color,
    })
    .from(profiles);

  if (!profilesData) return [];

  const linksData = await db
    .select({
      uuid: profileLinks.uuid,
      platform: profileLinks.platform,
      url: profileLinks.url,
      visible: profileLinks.visible,
    })
    .from(profileLinks);

  // Remove uuid from both profile and links before returning
  const filteredData = profilesData.map(({ uuid, ...profile }) => ({
    ...profile,
    links: linksData.filter((link) => link.uuid === uuid).map(({ uuid, ...rest }) => rest),
  }));

  return filteredData;
}
