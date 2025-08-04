'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useProfileMutation } from '@/hooks/use-profile';
import { processFormData, processZodError, zUsernameSchema } from '@/lib/auth/validator';
import type { PublicProfile } from '@/lib/db/schema';

export function UsernameSection({ profile }: { profile: PublicProfile }) {
  const [username, setUsername] = useState(profile.username);
  const mutation = useProfileMutation();

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If the username is the same as the current username, do nothing
    const formData = new FormData(e.target as HTMLFormElement);
    if (formData.get('username') === profile.username) return;

    // Validate form data
    const result = zUsernameSchema.safeParse(processFormData(formData));
    if (result.success) {
      toast.promise(mutation.mutateAsync(formData), {
        loading: 'Updating username...',
        success: 'Username updated successfully',
        error: 'Failed to update username',
      });
    } else {
      toast.error(processZodError(result.error).split(';').join('\n'));
    }
  };

  return (
    <form onSubmit={handleUsernameSubmit}>
      <Card className="py-4">
        <CardContent className="flex flex-col gap-4 px-4">
          <CardTitle className="text-xl font-bold">Username</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            This is your URL namespace within Changeling VR.
          </CardDescription>
          <Input
            name="username"
            maxLength={15}
            className="w-[300px]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Separator />
          <CardFooter className="flex justify-between p-0">
            <p className="text-muted-foreground text-sm">Please use 15 characters at maximum.</p>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save'
              )}
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </form>
  );
}
