'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPassword } from '@/lib/auth/actions';
import type { ActionState } from '@/lib/auth/middleware';

export default function ForgotPasswordPageClient() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(forgotPassword, {
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

          {state?.error && <FormMessage type="error" message={state.error} />}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Sending...' : 'Send reset email'}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm">
          Return to{' '}
          <Link href="/auth/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </CardContent>
  );
}
