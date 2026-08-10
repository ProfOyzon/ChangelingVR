import { z } from 'zod';
import { type SessionData, getSession } from './session';
import { processFormData, processZodError } from './validator';

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any;
};

type ValidatedActionFunction<S extends z.ZodType, T> = (data: z.output<S>) => Promise<T>;

/**
 * Validates the form data and returns the data
 * @param schema - The Zod schema
 * @param action - The action to perform
 * @returns The resulting data of the action
 */
export function validatedAction<S extends z.ZodType, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>,
) {
  return async (_prevState: ActionState, formData: FormData) => {
    const result = schema.safeParse(processFormData(formData));
    if (!result.success) {
      // returns error object for client
      return { error: processZodError(result.error) };
    }

    return action(result.data);
  };
}

type ValidatedActionWithUserFunction<S extends z.ZodType, T> = (
  data: z.output<S>,
  session: SessionData,
) => Promise<T>;

/**
 * Validates the form data and returns the data
 * @param schema - The Zod schema
 * @param action - The action to perform
 * @returns The resulting data of the action with the session data
 */
export function validatedActionWithUser<S extends z.ZodType, T>(
  schema: S,
  action: ValidatedActionWithUserFunction<S, T>,
) {
  return async (_prevState: ActionState, formData: FormData) => {
    const session = await getSession();
    if (
      !session ||
      !session.user ||
      typeof session.user.id !== 'string' ||
      new Date(session.expires) < new Date()
    ) {
      // throws error for toast to pick up
      throw new Error('You are not authenticated');
    }

    const result = schema.safeParse(processFormData(formData));
    if (!result.success) {
      // throws error for toast to pick up
      throw new Error(processZodError(result.error));
    }

    return action(result.data, session);
  };
}
