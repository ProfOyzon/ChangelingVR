'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useProfileMutation } from '@/hooks/use-profile';
import { processFormData, processZodError, zBioSchema } from '@/lib/auth/validator';
import type { FullProfile } from '@/lib/db/schema';

export function BioSection({ profile }: { profile: FullProfile }) {
  const [bio, setBio] = useState<string>(profile.bio || '');
  const mutation = useProfileMutation();

  const handleBioSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If the bio is the same as the current bio, do nothing
    const formData = new FormData(e.target as HTMLFormElement);
    if (formData.get('bio') === profile.bio) return;

    // Validate form data
    const result = zBioSchema.safeParse(processFormData(formData));
    if (result.success) {
      toast.promise(mutation.mutateAsync(formData), {
        loading: 'Updating bio...',
        success: 'Bio updated successfully',
        error: 'Failed to update bio',
      });
    } else {
      toast.error(processZodError(result.error).split(';').join('\n'));
    }
  };

  return (
    <form onSubmit={handleBioSubmit}>
      <Card className="py-4">
        <CardContent className="flex flex-col gap-4 px-4">
          <CardTitle className="text-xl font-bold">About Me</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            This is your bio within Changeling VR.
          </CardDescription>
          <Textarea
            name="bio"
            maxLength={500}
            rows={4}
            className="h-20 w-full resize-none"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
          <Separator />
          <CardFooter className="flex justify-between p-0">
            <p className="text-muted-foreground text-sm">Please use 500 characters at maximum.</p>
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
