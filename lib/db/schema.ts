import * as schema from '@/drizzle/schema';

export * from '@/drizzle/schema';
export * from '@/drizzle/relations';

export type {
  profiles as Profiles,
  profileLinks as ProfileLinks,
  resetTokens as ResetTokens,
  activityLogs as ActivityLogs,
  members as Members,
  cron as Cron,
} from '@/drizzle/schema';

type Simplify<T> = { [K in keyof T]: T[K] } & {};

export type Cron = typeof schema.cron.$inferSelect;
export type Member = typeof schema.members.$inferSelect;
export type NewMember = typeof schema.members.$inferInsert;
export type Profile = typeof schema.profiles.$inferSelect;
export type NewProfile = typeof schema.profiles.$inferInsert;
export type ProfileLink = typeof schema.profileLinks.$inferSelect;
export type NewProfileLink = typeof schema.profileLinks.$inferInsert;
export type ResetToken = typeof schema.resetTokens.$inferSelect;
export type NewResetToken = typeof schema.resetTokens.$inferInsert;
export type ActivityLog = typeof schema.activityLogs.$inferSelect;
export type NewActivityLog = typeof schema.activityLogs.$inferInsert;

export type PublicProfile = Simplify<Omit<Profile, 'uuid'>>;
export type PublicProfileLink = Simplify<Omit<ProfileLink, 'uuid'>>;
export type FullProfile = Simplify<PublicProfile & { links: PublicProfileLink[] }>;

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
}
