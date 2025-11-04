import { z } from 'zod/v4';

// Helper: Coerce FormData entries into array or null via sentinel "__EMPTY__"
const arrayOrNull = (item: z.ZodTypeAny, map?: (v: unknown) => unknown) =>
  z.preprocess(
    (val) => {
      if (val === '__EMPTY__') return null;
      if (val == null) return undefined;
      const asArray = Array.isArray(val) ? (val as unknown[]) : [val];
      return map ? asArray.map(map) : asArray;
    },
    z.union([z.array(item), z.null()]),
  );

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
  email: z.email().trim(),
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
  displayName: z
    .string()
    .trim()
    .max(50, { error: 'Display name must be less than 50 characters' })
    .optional(),
});

export const zBioSchema = z.object({
  bio: z.string().trim().max(500, { error: 'Bio must be less than 500 characters' }).optional(),
});

export const zTermsSchema = z.object({
  terms: arrayOrNull(z.number(), Number).optional(),
});

export const zRolesSchema = z.object({
  roles: arrayOrNull(z.string()).optional(),
});

export const zTeamsSchema = z.object({
  teams: arrayOrNull(z.string()).optional(),
});

export const zUpdateProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { error: 'Username must be at least 3 characters long' })
    .max(15, { error: 'Username must be less than 15 characters' })
    .regex(/^[a-z0-9]+$/, { error: 'Username can only contain lowercase letters and numbers' })
    .optional(),
  displayName: z
    .string()
    .trim()
    .max(50, { error: 'Display name must be less than 50 characters' })
    .optional(),
  bio: z.string().trim().max(500, { error: 'Bio must be less than 500 characters' }).optional(),
  terms: arrayOrNull(z.number(), Number).optional(),
  roles: arrayOrNull(z.string()).optional(),
  teams: arrayOrNull(z.string()).optional(),
  avatarUrl: z.url().optional(),
  bgColor: z.string().trim().optional(),
});

// These are the platforms that are supported for profile links
const platformEnum = ['github', 'linkedin', 'email', 'website', 'x', 'instagram'] as const;

export const zPlatformSchema = z.object({
  platform: z.enum(platformEnum),
});

export const zProfileLinkSchema = z.object({
  platform: z.enum(platformEnum),
  url: z.union([z.url({ message: 'Invalid URL' }), z.email({ message: 'Invalid email' })]),
  visible: z.string().transform((val) => val === 'true'),
});

export type RegisterInput = z.infer<typeof zRegisterSchema>;
export type LoginInput = z.infer<typeof zLoginSchema>;
export type ForgotPasswordInput = z.infer<typeof zForgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof zUpdatePasswordSchema>;
