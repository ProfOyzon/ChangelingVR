import { relations } from 'drizzle-orm/relations';
import { activityLogs, members, profileLinks, profiles, resetTokens } from './schema';

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  member: one(members, {
    fields: [activityLogs.uuid],
    references: [members.uuid],
  }),
}));

export const membersRelations = relations(members, ({ many }) => ({
  activityLogs: many(activityLogs),
  profiles: many(profiles),
  resetTokens: many(resetTokens),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  member: one(members, {
    fields: [profiles.uuid],
    references: [members.uuid],
  }),
  profileLinks: many(profileLinks),
}));

export const resetTokensRelations = relations(resetTokens, ({ one }) => ({
  member: one(members, {
    fields: [resetTokens.uuid],
    references: [members.uuid],
  }),
}));

export const profileLinksRelations = relations(profileLinks, ({ one }) => ({
  profile: one(profiles, {
    fields: [profileLinks.uuid],
    references: [profiles.uuid],
  }),
}));
