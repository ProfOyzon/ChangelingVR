'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/lib/auth/actions';
import type { ActionState } from '@/lib/auth/middleware';

export default function LoginPageClient({ ip }: { ip: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(login, { error: '' });

  return (
    <CardContent>
      <form action={formAction}>
        <input type="hidden" name="ip" value={ip} />

        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state.email}
              required
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              defaultValue={state.password}
              required
            />
          </div>

          {state?.error && <FormMessage type="error" message={state.error} />}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </CardContent>
  );
}
