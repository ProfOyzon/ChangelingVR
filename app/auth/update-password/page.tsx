import { FormMessage } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { encodedRedirect } from '@/lib/redirect';
import { createClient } from '@/lib/supabase/server';
import { updatePasswordAction } from '../actions';

export default async function LegacyResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email: string; uuid: string; token: string; error?: string }>;
}) {
  const supabase = createClient();
  const { email, uuid, token, error } = await searchParams;

  // Get the reset token from the reset_tokens table
  const { data: tokenData, error: tokenError } = await supabase
    .from('reset_tokens')
    .select('*')
    .eq('uuid', uuid)
    .single();

  // Supabase error or no token found
  if (tokenError || !tokenData.token) {
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

  // Check if the token is valid
  if (tokenData.token !== token) {
    encodedRedirect(
      'error',
      '/auth/forgot-password',
      'The password reset link is invalid. Please request a new one.',
    );
  }

  // Fetch the member's uuid with email
  const { data: memberData, error: memberError } = await supabase
    .from('members')
    .select('uuid')
    .eq('email', email)
    .single();

  // Check if the member's uuid matches the token's uuid
  if (memberError || memberData.uuid !== uuid) {
    encodedRedirect(
      'error',
      '/auth/forgot-password',
      'The password reset link is invalid. Please request a new one.',
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
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="uuid" value={uuid} />

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
