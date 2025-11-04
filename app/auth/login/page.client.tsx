'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { FormMessage } from '@/components/form-message';
import { login } from '@/lib/auth/actions';
import type { ActionState } from '@/lib/auth/middleware';

export default function LoginPageClient() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(login, { error: '' });

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
          <div className="flex items-center">
            <label htmlFor="password" className="text-sm text-gray-200">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            defaultValue={state.password}
            required
            className="h-9 w-full min-w-0 rounded-md border border-gray-500/50 px-3 py-1 text-base shadow-xs outline-none md:text-sm"
          />
        </div>

        {state?.error && <FormMessage type="error" message={state.error} />}

        <button
          type="submit"
          className="w-full cursor-pointer rounded-md border border-gray-500/50 bg-gray-300 px-3 py-2 text-sm font-bold text-black hover:bg-gray-400 [&_svg]:size-4"
          disabled={pending}
          aria-disabled={pending}
        >
          {pending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>
      </div>
    </form>
  );
}
