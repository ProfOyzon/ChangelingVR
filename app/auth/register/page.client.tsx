'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { FormMessage } from '@/components/form-message';
import { register } from '@/lib/auth/actions';
import type { ActionState } from '@/lib/auth/middleware';

export default function RegisterPageClient() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(register, {
    error: '',
  });

  return (
    <form action={formAction}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm text-gray-200">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={state.email}
            required
            className="h-9 w-full min-w-0 rounded-md border border-gray-500/50 px-3 py-1 text-base shadow-xs outline-none md:text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm text-gray-200">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            defaultValue={state.password}
            required
            className="h-9 w-full min-w-0 rounded-md border border-gray-500/50 px-3 py-1 text-base shadow-xs outline-none md:text-sm"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="accessCode" className="text-sm text-gray-200">
            Access Code
          </label>
          <input
            id="accessCode"
            name="accessCode"
            type="password"
            defaultValue={state.accessCode}
            required
            className="h-9 w-full min-w-0 rounded-md border border-gray-500/50 px-3 py-1 text-base shadow-xs outline-none md:text-sm"
          />
        </div>

        {state.error && <FormMessage type="error" message={state.error} />}

        <button
          type="submit"
          className="w-full cursor-pointer rounded-md border border-gray-500/50 bg-gray-300 px-3 py-2 text-sm font-bold text-black hover:bg-gray-400 [&_svg]:size-4"
          disabled={pending}
          aria-disabled={pending}
        >
          {pending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> Creating an account...
            </span>
          ) : (
            'Sign up'
          )}
        </button>
      </div>
    </form>
  );
}
