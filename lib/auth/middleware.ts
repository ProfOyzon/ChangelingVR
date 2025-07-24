import { z } from 'zod/v4';
import { getUserProfile } from '@/lib/db/queries';
import type { Profile } from '../db/schema';

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any;
};

/**
 * Processes a Zod error and returns a string of the error messages
 * @param error - The Zod error
 * @returns A string of the error messages
 */
function processZodError(error: z.ZodError) {
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
function processFormData(formData: FormData) {
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

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (data: z.infer<S>) => Promise<T>;

/**
 * Validates the form data and returns the data
 * @param schema - The Zod schema
 * @param action - The action to perform
 * @returns The resulting data of the action
 */
export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>,
) {
  return async (prevState: ActionState, formData: FormData) => {
    const result = schema.safeParse(processFormData(formData));
    if (!result.success) {
      return { error: processZodError(result.error) };
    }

    return action(result.data);
  };
}

type ValidatedActionWithUserFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData,
  user: Profile,
) => Promise<T>;

/**
 * Validates the form data and returns the data
 * @param schema - The Zod schema
 * @param action - The action to perform
 * @returns The resulting data of the action
 */
export function validatedActionWithUser<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionWithUserFunction<S, T>,
) {
  return async (prevState: ActionState, formData: FormData) => {
    const user = await getUserProfile();
    if (!user) {
      throw new Error('User is not authenticated');
    }

    const result = schema.safeParse(processFormData(formData));
    if (!result.success) {
      return { error: processZodError(result.error) };
    }

    return action(result.data, formData, user);
  };
}
