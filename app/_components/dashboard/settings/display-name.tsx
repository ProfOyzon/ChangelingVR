'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useProfileMutation } from '@/hooks/use-profile';
import { processFormData, processZodError, zDisplayNameSchema } from '@/lib/auth/validator';
import type { Profile } from '@/lib/db/schema';

export function DisplayNameSection({ profile }: { profile: Profile }) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? '');
  const mutation = useProfileMutation();

  const handleDisplayNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    if (formData.get('display_name') === profile.display_name) return;

    const result = zDisplayNameSchema.safeParse(processFormData(formData));
    if (result.success) {
      toast.promise(mutation.mutateAsync(formData), {
        loading: 'Updating display name...',
        success: 'Display name updated successfully',
        error: 'Failed to update display name',
      });
    } else {
      toast.error(processZodError(result.error).split(';').join('\n'));
    }
  };

  return (
    <form onSubmit={handleDisplayNameSubmit}>
      <Card className="py-4">
        <CardContent className="flex flex-col gap-4 px-4">
          <CardTitle className="text-xl font-bold">Display Name</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Please enter your full name, or a display name you are comfortable with.
          </CardDescription>
          <Input
            name="display_name"
            maxLength={30}
            className="w-[300px]"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <Separator />
          <CardFooter className="flex justify-between p-0">
            <p className="text-muted-foreground text-sm">Please use 30 characters at maximum.</p>
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
