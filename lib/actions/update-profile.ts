'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { eq } from 'drizzle-orm';
import { logActivity } from '@/lib/actions/log-activity';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { zUpdateProfileSchema } from '@/lib/auth/validator';
import { db } from '@/lib/db';
import { ActivityType, profiles } from '@/lib/db/schema';

/**
 * Validates the update profile form data and updates the user's profile
 */
export const updateProfile = validatedActionWithUser(
  zUpdateProfileSchema,
  async (data, session) => {
    try {
      const updateData: Partial<typeof profiles.$inferInsert> = {
        username: data.username,
        displayName: data.displayName,
        bio: data.bio,
        terms: data.terms as number[] | null | undefined,
        roles: data.roles as string[] | null | undefined,
        teams: data.teams as string[] | null | undefined,
        avatarUrl: data.avatarUrl,
      };

      const [profile] = await Promise.all([
        db
          .update(profiles)
          .set(updateData)
          .where(eq(profiles.uuid, session.user.id))
          .returning({ username: profiles.username }),
        logActivity(session.user.id, ActivityType.UPDATE_ACCOUNT),
      ]);

      updateTag(`profile:${profile[0].username}`);
      revalidatePath('/dashboard/profile');
      revalidatePath('/dashboard/settings');
    } catch (error: unknown) {
      const cause = error instanceof Error ? error.cause : undefined;
      // Check if it's a PostgreSQL unique constraint violation for the username
      if (
        typeof cause === 'object' &&
        cause !== null &&
        'code' in cause &&
        'constraint_name' in cause &&
        cause.code === '23505' &&
        cause.constraint_name === 'profiles_username_key'
      ) {
        throw new Error(`The username '${data.username}' is already taken`);
      }

      // It failed, return the error
      throw new Error('Failed to update profile');
    }
  },
);
