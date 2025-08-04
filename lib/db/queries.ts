'use server';

import { cache } from 'react';
import { and, count, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { activityLogs, members, profileLinks, profiles } from './schema';
import type { FullProfile } from './schema';

// Fetches profile table; requires session cookie
export async function getProfile() {
  const session = await getSession();
  if (
    !session ||
    !session.user ||
    typeof session.user.id !== 'string' ||
    new Date(session.expires) < new Date()
  ) {
    return null;
  }

  const profile = await db
    .select({
      username: profiles.username,
      display_name: profiles.display_name,
      avatar_url: profiles.avatar_url,
      bio: profiles.bio,
      terms: profiles.terms,
      teams: profiles.teams,
      roles: profiles.roles,
      bg_color: profiles.bg_color,
    })
    .from(profiles)
    .where(eq(profiles.uuid, session.user.id))
    .limit(1);

  if (profile.length === 0) {
    return null;
  }

  return profile[0];
}

// Fetches full profile table; requires session cookie
export async function getFullProfile() {
  const session = await getSession();
  if (
    !session ||
    !session.user ||
    typeof session.user.id !== 'string' ||
    new Date(session.expires) < new Date()
  ) {
    return null;
  }

  const profile = await db
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
    .from(profiles)
    .where(eq(profiles.uuid, session.user.id))
    .limit(1);

  if (!profile || profile.length === 0) {
    return null;
  }

  const { uuid, ...filtered } = profile[0];

  const links = await db
    .select({
      platform: profileLinks.platform,
      url: profileLinks.url,
      visible: profileLinks.visible,
    })
    .from(profileLinks)
    .where(eq(profileLinks.uuid, session.user.id));

  return { ...filtered, links };
}

// Fetches activity logs table; requires session cookie
export async function getActivityLogs() {
  const session = await getSession();
  if (
    !session ||
    !session.user ||
    typeof session.user.id !== 'string' ||
    new Date(session.expires) < new Date()
  ) {
    return null;
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
    .where(eq(activityLogs.uuid, session.user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

// Fetches profile by username
export const getProfileByUsername = cache(async (username: string) => {
  const profile = await db
    .select({
      uuid: profiles.uuid,
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

  const { uuid, ...filtered } = profile[0];

  const links = await db
    .select({
      platform: profileLinks.platform,
      url: profileLinks.url,
      visible: profileLinks.visible,
    })
    .from(profileLinks)
    .where(and(eq(profileLinks.uuid, uuid), eq(profileLinks.visible, true)));

  return { ...filtered, links };
});

// Fetches complete profiles table
export async function getAllProfiles(): Promise<FullProfile[]> {
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

  if (!profilesData || profilesData.length === 0) return [];

  // Get all profile links for all profiles
  const allLinks = await db
    .select({
      uuid: profileLinks.uuid,
      platform: profileLinks.platform,
      url: profileLinks.url,
      visible: profileLinks.visible,
    })
    .from(profileLinks)
    .where(eq(profileLinks.visible, true));

  // Group links by profile UUID
  const linksByProfile = allLinks.reduce(
    (acc, link) => {
      if (!acc[link.uuid]) {
        acc[link.uuid] = [];
      }
      acc[link.uuid].push({
        platform: link.platform,
        url: link.url,
        visible: link.visible,
      });
      return acc;
    },
    {} as Record<string, { platform: string; url: string; visible: boolean }[]>,
  );

  // Map profiles to FullProfile objects
  return profilesData.map((profile) => {
    const { uuid, ...profileData } = profile;
    return {
      ...profileData,
      links: linksByProfile[uuid] || [],
    };
  });
}

// 4 columns in a 1440px screen (according to Thaw Thaw, this is standard)
const PAGE_SIZE = 28;

/**
 * Returns the number of pages for a given query
 * @param query - The query to search for
 * @returns The number of pages
 */
export const getProfilePages = cache(async (query: string) => {
  const result = await db
    .select({ value: count() })
    .from(profiles)
    .where(ilike(profiles.display_name, `%${query}%`));

  return Math.ceil((result[0]?.value || 0) / PAGE_SIZE);
});

/**
 * Returns the profiles for a given query and page
 * @param query - The query to search for
 * @param page - The page number
 * @returns The profiles
 */
export const getFilteredProfiles = cache(async (query: string, page: number) => {
  const result = await db
    .select({
      username: profiles.username,
      display_name: profiles.display_name,
      avatar_url: profiles.avatar_url,
      bio: profiles.bio,
      terms: profiles.terms,
      teams: profiles.teams,
      roles: profiles.roles,
      bg_color: profiles.bg_color,
    })
    .from(profiles)
    .where(
      and(
        // Match display name
        ilike(profiles.display_name, `%${query}%`),
        // Ensure display name is not null or empty
        sql`${profiles.display_name} IS NOT NULL AND ${profiles.display_name} != ''`,
      ),
    )
    .orderBy(
      // Prioritize profiles with the most terms
      sql`COALESCE((SELECT MAX(x) FROM unnest(${profiles.terms}) AS x), 0) DESC`,
      // Sort by display name alphabetically
      profiles.display_name,
    )
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  return result;
});
