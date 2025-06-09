'use client';

import { useActionState } from 'react';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updatePassword } from '@/lib/auth/actions';
import type { ActionState } from '@/lib/auth/middleware';

export default function UpdatePasswordPageClient({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(updatePassword, {
    error: '',
  });

  return (
    <CardContent>
      <form action={formAction}>
        <input type="hidden" name="token" value={token} />

        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              defaultValue={state.password}
              minLength={6}
              required
            />
          </div>

          {state?.error && <FormMessage type="error" message={state.error} />}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save new password'}
          </Button>
        </div>
      </form>
    </CardContent>
  );
}
