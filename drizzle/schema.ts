import {
  bigint,
  boolean,
  foreignKey,
  index,
  pgSequence,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

export const usersIdSeq = pgSequence('users_id_seq', {
  startWith: '1',
  increment: '1',
  minValue: '1',
  maxValue: '9223372036854775807',
  cache: '1',
  cycle: false,
});

export const activityLogs = pgTable(
  'activity_logs',
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).generatedByDefaultAsIdentity({
      name: 'activity_logs_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    uuid: uuid().notNull(),
    action: text().notNull(),
    timestamp: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    country: text(),
    countryCode: text('country_code'),
    region: text(),
    city: text(),
    latitude: text(),
    longitude: text(),
    zip: text(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.uuid],
      foreignColumns: [members.uuid],
      name: 'activity_logs_uuid_fkey',
    }).onDelete('cascade'),
    unique('activity_logs_id_key').on(table.id),
  ],
);

export const cron = pgTable('cron', {
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
    name: 'cron_id_seq',
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 9223372036854775807,
    cache: 1,
  }),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const members = pgTable(
  'members',
  {
    uuid: uuid().defaultRandom().primaryKey().notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint({ mode: 'number' }).generatedByDefaultAsIdentity({
      name: 'members_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 9223372036854775807,
      cache: 1,
    }),
    email: text().notNull(),
    password: text().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
  },
  (table) => [unique('members_id_key').on(table.id), unique('members_email_key').on(table.email)],
);

export const profiles = pgTable(
  'profiles',
  {
    uuid: uuid().primaryKey().notNull(),
    username: text().notNull(),
    displayName: text('display_name'),
    bio: text(),
    terms: smallint().array(),
    teams: text().array(),
    roles: text().array(),
    bgColor: text('bg_color').default('light-sky').notNull(),
    avatarUrl: text('avatar_url'),
  },
  (table) => [
    index('profiles_uuid_idx').using('btree', table.uuid.asc().nullsLast().op('uuid_ops')),
    foreignKey({
      columns: [table.uuid],
      foreignColumns: [members.uuid],
      name: 'profiles_uuid_fkey',
    }).onDelete('cascade'),
    unique('profiles_username_key').on(table.username),
  ],
);

export const resetTokens = pgTable(
  'reset_tokens',
  {
    uuid: uuid().primaryKey().notNull(),
    token: text().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.uuid],
      foreignColumns: [members.uuid],
      name: 'reset_tokens_uuid_fkey',
    }).onDelete('cascade'),
  ],
);

export const profileLinks = pgTable(
  'profile_links',
  {
    uuid: uuid().notNull(),
    platform: text().notNull(),
    url: text().notNull(),
    visible: boolean().default(false).notNull(),
  },
  (table) => [
    index('profile_links_uuid_idx').using('btree', table.uuid.asc().nullsLast().op('uuid_ops')),
    foreignKey({
      columns: [table.uuid],
      foreignColumns: [profiles.uuid],
      name: 'profile_links_uuid_fkey',
    }).onDelete('cascade'),
    primaryKey({ columns: [table.uuid, table.platform], name: 'profile_links_pkey' }),
  ],
);
