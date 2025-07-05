import { z } from 'zod/v4';

export const zRegisterSchema = z.object({
  email: z.email().trim().endsWith('@rit.edu', { error: 'Email must be a RIT email (@rit.edu)' }),
  password: z
    .string()
    .min(6, { error: 'Password must be at least 6 characters long' })
    .regex(/[A-Z]/, { error: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { error: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { error: 'Password must contain at least one special character' }),
  accessCode: z
    .string()
    .trim()
    .refine((code) => code === process.env.AUTH_ACCESS_CODE, { message: 'Invalid access code' }),
});

export const zLoginSchema = z.object({
  email: z.email().trim(),
  password: z.string(),
});

export const zForgotPasswordSchema = z.object({
  email: z.email().trim(),
});

export const zUpdatePasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(6, { error: 'Password must be at least 6 characters long' })
    .regex(/[A-Z]/, { error: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { error: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { error: 'Password must contain at least one special character' }),
});

export const zUpdateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { error: 'Username must be at least 3 characters long' })
    .max(15, { error: 'Username must be less than 15 characters' })
    .regex(/^[a-z0-9]+$/, { error: 'Username can only contain lowercase letters and numbers' }),
  display_name: z
    .string()
    .trim()
    .max(50, { error: 'Display name must be less than 50 characters' })
    .optional(),
  bio: z.string().trim().max(500, { error: 'Bio must be less than 500 characters' }).optional(),
  terms: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => {
      if (!val) return [];
      const arr = Array.isArray(val) ? val : [val];
      return arr.map((v) => parseInt(v, 10));
    })
    .optional(),
  roles: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    })
    .optional(),
  teams: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    })
    .optional(),
  avatar_url: z.url().optional(),
  bg_color: z.string().trim().optional(),
});

export type RegisterInput = z.infer<typeof zRegisterSchema>;
export type LoginInput = z.infer<typeof zLoginSchema>;
export type ForgotPasswordInput = z.infer<typeof zForgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof zUpdatePasswordSchema>;
