'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useProfileMutation } from '@/hooks/use-profile';
import type { PublicProfile } from '@/lib/db/schema';
import { resizeAndConvertToWebP } from '@/lib/process-avatar';
import type { PutBlobResult } from '@vercel/blob';

export function AvatarSection({ profile }: { profile: PublicProfile }) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar_url ?? '/placeholder.png');
  const mutation = useProfileMutation();

  /**
   * Handle the avatar change event. Resize and convert the image to webp.
   * @param e - The change event.
   */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const processedBlob = await resizeAndConvertToWebP(file);
      setAvatarFile(new File([processedBlob], profile.username, { type: 'image/webp' }));
      setAvatarPreview(URL.createObjectURL(processedBlob));
    }
  };

  /**
   * Handle the avatar submit event. Upload the avatar to the blob storage.
   * @param e - The submit event.
   */
  const handleAvatarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!avatarFile) {
      return toast.error('Please select an image file.');
    }

    toast.promise(
      (async () => {
        // Upload the avatar to the blob storage
        const res = await fetch(`/api/avatar/upload?filename=${avatarFile.name}.webp`, {
          method: 'POST',
          body: avatarFile,
        });

        // Check if upload was successful
        if (!res.ok) throw new Error('Upload failed');
        const blob = (await res.json()) as PutBlobResult;

        // Update the profile with the new avatar URL
        const updateForm = new FormData();
        updateForm.append('avatar_url', blob.url);
        return mutation.mutateAsync(updateForm);
      })(),
      {
        loading: 'Updating avatar...',
        success: 'Avatar updated successfully',
        error: (error) => (error instanceof Error ? error.message : 'Failed to update avatar'),
      },
    );

    setAvatarFile(null);
  };

  return (
    <form onSubmit={handleAvatarSubmit}>
      <Card className="py-4">
        <CardContent className="flex flex-col gap-4 px-4">
          <div className="flex flex-row items-start justify-between">
            <div className="flex flex-col gap-4">
              <CardTitle className="text-xl font-bold">Avatar</CardTitle>
              <CardDescription className="text-muted-foreground flex flex-col text-sm">
                <p>This is your avatar.</p>
                <p>Click on the avatar to upload a custom one from your files.</p>
              </CardDescription>
            </div>
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Avatar className="size-20 rounded-md">
                <AvatarImage src={avatarPreview} />
              </Avatar>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                required
              />
            </label>
          </div>
          <Separator />
          <CardFooter className="flex justify-between p-0">
            <p className="text-muted-foreground text-sm">
              An avatar is optional but strongly recommended.
            </p>
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
