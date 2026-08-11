'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { logActivity } from '@/lib/actions/log-activity';
import { validatedActionWithUser } from '@/lib/auth/middleware';
import { zProfileLinkSchema } from '@/lib/auth/validator';
import { db } from '@/lib/db';
import { ActivityType, profileLinks, profiles } from '@/lib/db/schema';

export const updateProfileLink = validatedActionWithUser(
  zProfileLinkSchema,
  async (data, session) => {
    try {
      // determine wheter to delete or upsert the profile link based on url
      const mutation =
        data.url === null
          ? db
              .delete(profileLinks)
              .where(
                and(
                  eq(profileLinks.uuid, session.user.id),
                  eq(profileLinks.platform, data.platform),
                ),
              )
          : db
              .insert(profileLinks)
              .values({
                uuid: session.user.id,
                platform: data.platform,
                url: data.url,
                visible: data.visible,
              })
              .onConflictDoUpdate({
                target: [profileLinks.uuid, profileLinks.platform],
                set: {
                  url: data.url,
                  visible: data.visible,
                },
              });

      const [profile] = await Promise.all([
        db
          .select({ username: profiles.username })
          .from(profiles)
          .where(eq(profiles.uuid, session.user.id)),
        mutation,
        logActivity(session.user.id, ActivityType.UPDATE_ACCOUNT),
      ]);

      updateTag(`profile:${profile[0].username}`);
      revalidatePath('/dashboard/connections');

      return { success: true, username: profile[0].username };
    } catch {
      return { success: false, error: 'Failed to update profile link' };
    }
  },
);
