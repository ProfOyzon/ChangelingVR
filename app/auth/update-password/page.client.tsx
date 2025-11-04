'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { FormMessage } from '@/components/form-message';
import { updatePassword } from '@/lib/auth/actions';
import type { ActionState } from '@/lib/auth/middleware';

export default function UpdatePasswordPageClient({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(updatePassword, {
    error: '',
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />

      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm text-gray-200">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            defaultValue={state.password}
            minLength={6}
            required
            className="h-9 w-full min-w-0 rounded-md border border-gray-500/50 px-3 py-1 text-base shadow-xs outline-none md:text-sm"
          />
        </div>

        {state?.error && <FormMessage type="error" message={state.error} />}

        <button
          type="submit"
          className="w-full cursor-pointer rounded-md border border-gray-500/50 bg-gray-300 px-3 py-2 text-sm font-bold text-black hover:bg-gray-400 [&_svg]:size-4"
          disabled={isPending}
          aria-disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> Saving...
            </span>
          ) : (
            'Save new password'
          )}
        </button>
      </div>
    </form>
  );
}
