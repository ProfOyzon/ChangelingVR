import { z } from 'zod/v4';
import { getUserProfile } from '@/lib/db/queries';
import type { Profile } from '../db/schema';

function processError(error: z.ZodError) {
  return z
    .prettifyError(error)
    .split('\n')
    .filter((line) => !line.trim().startsWith('→'))
    .join(';');
}

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any;
};

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

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData,
) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>,
) {
  return async (prevState: ActionState, formData: FormData) => {
    const result = schema.safeParse(processFormData(formData));
    if (!result.success) {
      return { error: processError(result.error) };
    }

    return action(result.data, formData);
  };
}

type ValidatedActionWithUserFunction<S extends z.ZodType<any, any>, T> = (
  data: z.infer<S>,
  formData: FormData,
  user: Profile,
) => Promise<T>;

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
      return { error: processError(result.error) };
    }

    return action(result.data, formData, user);
  };
}
