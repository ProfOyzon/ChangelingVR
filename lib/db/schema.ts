import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

// Tables
export const activityLogs = pgTable('activity_logs', {
  id: bigint('id', { mode: 'number' }),
  uuid: uuid('uuid').notNull(),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  country: text('country'),
  country_code: text('country_code'),
  region: text('region'),
  city: text('city'),
  latitude: text('latitude'),
  longitude: text('longitude'),
  zip: text('zip'),
});

export const cron = pgTable('cron', {
  id: bigint('id', { mode: 'number' }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const members = pgTable('members', {
  uuid: uuid('uuid').notNull().defaultRandom(),
  id: bigint('id', { mode: 'number' }),
  email: text('email').notNull(),
  password: text('password').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }),
});

export const profileLinks = pgTable('profile_links', {
  uuid: uuid('uuid').notNull(),
  platform: text('platform').notNull(),
  url: text('url').notNull(),
  visible: boolean('visible').notNull().default(false),
});

export const profiles = pgTable('profiles', {
  uuid: uuid('uuid').notNull(),
  username: text('username').notNull(),
  display_name: text('display_name'),
  bio: text('bio'),
  terms: integer('terms').array(),
  teams: text('teams').array(),
  roles: text('roles').array(),
  avatar_url: text('avatar_url'),
  bg_color: text('bg_color').notNull().default('light-sky'),
});

export const resetTokens = pgTable('reset_tokens', {
  uuid: uuid('uuid').notNull(),
  token: text('token').notNull(),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const memberRelations = relations(members, ({ one }) => ({
  profile: one(profiles, {
    fields: [members.uuid],
    references: [profiles.uuid],
  }),
  activityLogs: one(activityLogs, {
    fields: [members.uuid],
    references: [activityLogs.uuid],
  }),
  resetTokens: one(resetTokens, {
    fields: [members.uuid],
    references: [resetTokens.uuid],
  }),
}));

export const profileRelations = relations(profiles, ({ one }) => ({
  member: one(members, {
    fields: [profiles.uuid],
    references: [members.uuid],
  }),
  links: one(profileLinks, {
    fields: [profiles.uuid],
    references: [profileLinks.uuid],
  }),
}));

export const activityLogRelations = relations(activityLogs, ({ one }) => ({
  member: one(members, {
    fields: [activityLogs.uuid],
    references: [members.uuid],
  }),
}));

export const profileLinkRelations = relations(profileLinks, ({ one }) => ({
  profile: one(profiles, {
    fields: [profileLinks.uuid],
    references: [profiles.uuid],
  }),
}));

export type Cron = typeof cron.$inferSelect;

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type ProfileLink = typeof profileLinks.$inferSelect;
export type NewProfileLink = typeof profileLinks.$inferInsert;
export type ResetToken = typeof resetTokens.$inferSelect;
export type NewResetToken = typeof resetTokens.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
}
