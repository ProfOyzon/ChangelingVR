import { z } from 'zod/v4';

/**
 * Processes a Zod error and returns a string of the error messages
 * @param error - The Zod error
 * @returns A string of the error messages
 */
export function processZodError(error: z.ZodError) {
  return z
    .prettifyError(error)
    .split('\n')
    .filter((line) => !line.trim().startsWith('→'))
    .join(';');
}

/**
 * Processes the form data and returns a record of the data
 * @param formData - The form data
 * @returns A record of the data
 */
export function processFormData(formData: FormData) {
  const data: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      if (!Array.isArray(data[key])) {
        data[key] = [data[key]];
      }
      data[key].push(value);
    } else {
      data[key] = value;
    }
  }
  return data;
}

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
    .refine((code) => code === process.env.AUTH_ACCESS_CODE, { message: 'Access Code is invalid' }),
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

export const zUsernameSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { error: 'Username must be at least 3 characters long' })
    .max(15, { error: 'Username must be less than 15 characters' })
    .regex(/^[a-z0-9]+$/, { error: 'Username can only contain lowercase letters and numbers' }),
});

export const zDisplayNameSchema = z.object({
  display_name: z
    .string()
    .trim()
    .max(50, { error: 'Display name must be less than 50 characters' })
    .optional(),
});

export const zBioSchema = z.object({
  bio: z.string().trim().max(500, { error: 'Bio must be less than 500 characters' }).optional(),
});

export const zTermsSchema = z.object({
  terms: z
    .string()
    .trim()
    .transform((val) => JSON.parse(val as string).map(Number)),
});

export const zRolesSchema = z.object({
  roles: z
    .string()
    .trim()
    .transform((val) => JSON.parse(val as string)),
});

export const zTeamsSchema = z.object({
  teams: z
    .string()
    .trim()
    .transform((val) => JSON.parse(val as string)),
});

export const zUpdateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { error: 'Username must be at least 3 characters long' })
    .max(15, { error: 'Username must be less than 15 characters' })
    .regex(/^[a-z0-9]+$/, { error: 'Username can only contain lowercase letters and numbers' })
    .optional(),
  display_name: z
    .string()
    .trim()
    .max(50, { error: 'Display name must be less than 50 characters' })
    .optional(),
  bio: z.string().trim().max(500, { error: 'Bio must be less than 500 characters' }).optional(),
  terms: z
    .string()
    .trim()
    .transform((val) => JSON.parse(val as string).map(Number))
    .optional(),
  roles: z
    .string()
    .trim()
    .transform((val) => JSON.parse(val as string))
    .optional(),
  teams: z
    .string()
    .trim()
    .transform((val) => JSON.parse(val as string))
    .optional(),
  avatar_url: z.url().optional(),
  bg_color: z.string().trim().optional(),
});

export const zPlatformSchema = z.object({
  platform: z.enum(['github', 'linkedin', 'email', 'website']),
});

export const zUpdateProfileLinkSchema = z.object({
  platform: z.enum(['github', 'linkedin', 'email', 'website']),
  url: z.union([z.url({ message: 'Invalid URL' }), z.email({ message: 'Invalid email' })]),
  visible: z.string().transform((val) => val === 'true'),
});

export type RegisterInput = z.infer<typeof zRegisterSchema>;
export type LoginInput = z.infer<typeof zLoginSchema>;
export type ForgotPasswordInput = z.infer<typeof zForgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof zUpdatePasswordSchema>;
