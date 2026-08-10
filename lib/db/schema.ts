import * as schema from '@/drizzle/schema';

export * from '@/drizzle/schema';
export * from '@/drizzle/relations';

type Profile = typeof schema.profiles.$inferSelect;
type ProfileLink = typeof schema.profileLinks.$inferSelect;

type PublicProfile = Omit<Profile, 'uuid'>;
export type PublicProfileLink = Omit<ProfileLink, 'uuid'>;

type Member = typeof schema.members.$inferSelect;
type PublicMemberDate = Pick<Member, 'createdAt' | 'updatedAt'>;

export type FullProfile = PublicProfile & {
  member: PublicMemberDate;
  profileLinks: PublicProfileLink[];
};

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
}
