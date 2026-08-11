import 'server-only';
import { cache } from 'react';
import { cacheLife, cacheTag } from 'next/cache';
import { count, ilike, or, sql } from 'drizzle-orm';
import { getAuthenticatedSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { profiles } from './schema';

/**
 * Fetches the profile of the currently logged-in user
 * @requires session
 */
export async function getProfile() {
  const auth = await getAuthenticatedSession();
  if (!auth || !auth.success) return null;

  const profile = await db.query.profiles.findFirst({
    where: { uuid: auth.session.user.id },
    columns: {
      uuid: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      terms: true,
      teams: true,
      roles: true,
    },
  });

  if (!profile) return null;
  return profile;
}

/**
 * Fetches the full profile of the currently logged-in user, including profile links
 * @requires session
 */
export async function getFullProfile() {
  const auth = await getAuthenticatedSession();
  if (!auth || !auth.success) return null;

  const profile = await db.query.profiles.findFirst({
    where: { uuid: auth.session.user.id },
    columns: {
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      terms: true,
      teams: true,
      roles: true,
    },
    with: {
      profileLinks: {
        where: { visible: true },
        columns: { platform: true, url: true },
      },
    },
  });

  if (!profile) return null;
  return profile;
}

/**
 * Fetches the activity logs of the currently logged-in user
 * @requires session
 */
export async function getActivityLogs() {
  const auth = await getAuthenticatedSession();
  if (!auth || !auth.success) return null;

  return await db.query.activityLogs.findMany({
    where: { uuid: auth.session.user.id },
    orderBy: { createdAt: 'desc' },
    limit: 10,
  });
}

export async function getConnections() {
  const auth = await getAuthenticatedSession();
  if (!auth || !auth.success) return null;

  return await db.query.profileLinks.findMany({
    where: { uuid: auth.session.user.id },
    columns: { platform: true, url: true, visible: true },
    orderBy: { platform: 'asc' },
  });
}

/**
 * Fetches the profile of a user by their username
 * @param username - The username of the user to fetch
 */
export const getProfileByUsername = cache(async (username: string) => {
  'use cache';
  cacheTag(`profile:${username}`);
  cacheLife('max');

  const profile = await db.query.profiles.findFirst({
    where: { username: username },
    columns: {
      displayName: true,
      username: true,
      avatarUrl: true,
      bio: true,
      terms: true,
      teams: true,
      roles: true,
    },
    with: {
      member: {
        columns: {
          createdAt: true,
          updatedAt: true,
        },
      },
      profileLinks: {
        where: { visible: true },
        columns: { platform: true, url: true },
      },
    },
  });

  if (!profile) return null;
  return profile;
});

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
    .where(or(ilike(profiles.displayName, `%${query}%`), ilike(profiles.username, `%${query}%`)));

  return Math.ceil((result[0]?.value || 0) / PAGE_SIZE);
});

/**
 * Returns the profiles for a given query and page
 * @param query - The query to search for
 * @param page - The page number
 * @returns Matching profiles ordered by recent terms, then display name.
 */
export const getFilteredProfiles = cache(async (query: string, page: number) => {
  const result = await db
    .select({
      username: profiles.username,
      displayName: profiles.displayName,
      avatarUrl: profiles.avatarUrl,
      bio: profiles.bio,
      terms: profiles.terms,
      teams: profiles.teams,
      roles: profiles.roles,
    })
    .from(profiles)
    .where(
      // Filter by display name or username, case-insensitive
      or(ilike(profiles.displayName, `%${query}%`), ilike(profiles.username, `%${query}%`)),
    )
    .orderBy(
      // Profiles with a display name or bio come first.
      // Completely empty profiles are always pushed to the bottom,
      // regardless of their `terms` value.
      sql`CASE
        WHEN ${profiles.displayName} IS NULL
          AND ${profiles.bio} IS NULL
        THEN 1
        ELSE 0
      END ASC`,
      // Among profiles with actual profile information,
      // prioritize the highest/latest term.
      sql`COALESCE(
        (SELECT MAX(x) FROM unnest(${profiles.terms}) AS x),
        0
      ) DESC`,
      // Finally, sort alphabetically by display name.
      // Profiles without a display name go last.
      sql`${profiles.displayName} NULLS LAST`,
    )
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  return result;
});

export const getUsernames = cache(async () => {
  return await db.query.profiles.findMany({
    columns: { username: true },
  });
});
