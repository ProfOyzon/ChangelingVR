import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  activityLogs: {
    member: r.one.members({
      from: r.activityLogs.uuid,
      to: r.members.uuid,
    }),
  },
  members: {
    activityLogs: r.many.activityLogs(),
    profiles: r.many.profiles(),
    resetTokens: r.many.resetTokens(),
  },
  profileLinks: {
    profile: r.one.profiles({
      from: r.profileLinks.uuid,
      to: r.profiles.uuid,
    }),
  },
  profiles: {
    profileLinks: r.many.profileLinks(),
    member: r.one.members({
      from: r.profiles.uuid,
      to: r.members.uuid,
    }),
  },
  resetTokens: {
    member: r.one.members({
      from: r.resetTokens.uuid,
      to: r.members.uuid,
    }),
  },
}));
