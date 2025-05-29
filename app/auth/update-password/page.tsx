import { FormMessage } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { encodedRedirect } from '@/lib/redirect';
import { createClient } from '@/lib/supabase/server';
import { updatePasswordAction } from '../actions';
import { hashToken } from '../utils';

export default async function LegacyResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string; error?: string }>;
}) {
  const { token, error } = await searchParams;
  const hashedToken = hashToken(token);

  // Get the reset token from the reset_tokens table
  const supabase = createClient();
  const { data: tokenData, error: tokenError } = await supabase
    .from('reset_tokens')
    .select('*')
    .eq('token', hashedToken)
    .single();

  // Supabase error or no token found
  if (tokenError || !tokenData) {
    encodedRedirect(
      'error',
      '/auth/forgot-password',
      'The password reset link is invalid. Please request a new one.',
    );
  }

  // Check if the token is expired
  if (tokenData.expires_at < new Date()) {
    encodedRedirect(
      'error',
      '/auth/forgot-password',
      'The password reset link has expired. Please request a new one.',
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        <CardDescription>Please enter your new password below.</CardDescription>
      </CardHeader>

      <CardContent>
        <form action={updatePasswordAction}>
          {/* Hidden inputs to pass to the action */}
          <input type="hidden" name="token" value={token} />

          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="New password"
                minLength={6}
                required
              />
            </div>

            {error && <FormMessage type="error" message={error} />}

            <SubmitButton pendingText="Saving..." className="w-full">
              Save new password
            </SubmitButton>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
