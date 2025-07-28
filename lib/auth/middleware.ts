import { z } from 'zod/v4';
import { getUserProfile } from '@/lib/db/queries';
import type { Profile } from '../db/schema';
import { processFormData, processZodError } from './validator';

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any;
};

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

    return action(result.data, user);
  };
}
