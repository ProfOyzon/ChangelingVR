'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/lib/auth/actions';
import type { ActionState } from '@/lib/auth/middleware';

export default function RegisterPageClient() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(register, {
    error: '',
  });

  return (
    <CardContent>
      <form action={formAction}>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              defaultValue={state.password}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="accessCode">Access Code</Label>
            <Input
              id="accessCode"
              name="accessCode"
              type="password"
              defaultValue={state.accessCode}
              required
            />
          </div>

          {state.error && <FormMessage type="error" message={state.error} />}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Creating an account...' : 'Sign up'}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </CardContent>
  );
}
