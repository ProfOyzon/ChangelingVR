import { z } from 'zod/v4';

//.endsWith('@rit.edu', { error: 'Email must be a RIT email (@rit.edu)' })
export const registerSchema = z.strictObject({
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
    .length(20, { error: 'Invalid access code' })
    .refine((code) => code === process.env.AUTH_ACCESS_CODE, { message: 'Invalid access code' }),
});

export const loginSchema = z.strictObject({
  email: z.email().trim(),
  password: z.string(),
});

export const forgotPasswordSchema = z.strictObject({
  email: z.email().trim(),
});

export const updatePasswordSchema = z.strictObject({
  email: z.email().trim(),
  uuid: z.string().min(1),
  password: z
    .string()
    .min(6, { error: 'Password must be at least 6 characters long' })
    .regex(/[A-Z]/, { error: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { error: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { error: 'Password must contain at least one special character' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
