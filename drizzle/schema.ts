import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  index,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const activityLogs = pgTable.withRLS(
  'activity_logs',
  {
    id: bigint({ mode: 'number' }).generatedByDefaultAsIdentity(),
    uuid: uuid()
      .notNull()
      .references(() => members.uuid, { onDelete: 'cascade' }),
    action: text().notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    country: text(),
    countryCode: text('country_code'),
    region: text(),
    city: text(),
    latitude: text(),
    longitude: text(),
    zip: text(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [unique('activity_logs_id_key').on(table.id)],
);

export const cron = pgTable.withRLS('cron', {
  id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
});

export const members = pgTable.withRLS(
  'members',
  {
    uuid: uuid().defaultRandom().primaryKey(),
    id: bigint({ mode: 'number' }).generatedByDefaultAsIdentity(),
    email: text().notNull(),
    password: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [unique('members_email_key').on(table.email), unique('members_id_key').on(table.id)],
);

export const profileLinks = pgTable.withRLS(
  'profile_links',
  {
    uuid: uuid()
      .notNull()
      .references(() => profiles.uuid, { onDelete: 'cascade' }),
    platform: text().notNull(),
    url: text().notNull(),
    visible: boolean().default(false).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.uuid, table.platform], name: 'profile_links_pkey' }),
    index('profile_links_uuid_idx').using('btree', table.uuid.asc().nullsLast()),
  ],
);

export const profiles = pgTable.withRLS(
  'profiles',
  {
    uuid: uuid()
      .primaryKey()
      .references(() => members.uuid, { onDelete: 'cascade' }),
    username: text().notNull(),
    displayName: text('display_name'),
    bio: text(),
    terms: smallint().array(),
    teams: text().array(),
    roles: text().array(),
    avatarUrl: text('avatar_url'),
  },
  (table) => [
    index('profiles_uuid_idx').using('btree', table.uuid.asc().nullsLast()),
    unique('profiles_username_key').on(table.username),
  ],
);

export const resetTokens = pgTable.withRLS('reset_tokens', {
  uuid: uuid()
    .primaryKey()
    .references(() => members.uuid, { onDelete: 'cascade' }),
  token: text().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
