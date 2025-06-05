import { z } from 'zod';

export const legacyUserSchema = z.object({
  username: z.string().min(1),
  bio: z.string().max(500).optional(),
  terms: z.string().optional(),
  roles: z.string().optional(),
  teams: z.string().optional(),
  link_email: z.string().optional(),
  link_website: z.string().optional(),
  link_github: z.string().optional(),
  link_linkedin: z.string().optional(),
});

export type LegacyUser = z.infer<typeof legacyUserSchema>;
