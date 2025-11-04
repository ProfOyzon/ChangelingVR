'use client';

import { useState } from 'react';
import { PutBlobResult } from '@vercel/blob';
import Image from 'next/image';
import { toast } from 'sonner';
import { updateProfile } from '@/lib/auth/actions';
import { ActionState } from '@/lib/auth/middleware';
import { resizeAndConvertToWebP } from '@/lib/process-avatar';

export function AvatarSection({
  username,
  avatarUrl,
}: {
  username: string;
  avatarUrl: string | null;
}) {
  const [isEdited, setIsEdited] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl || '/placeholder.png');

  // Handle the avatar change event. Resize and convert the image to webp.
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const processedBlob = await resizeAndConvertToWebP(file);
      setAvatarPreview(URL.createObjectURL(processedBlob));
      setAvatarFile(new File([processedBlob], username, { type: 'image/webp' }));
      setIsEdited(true);
    }
  }

  // Handle the avatar submit event. Upload the avatar to the blob storage and update the profile.
  async function handleAvatarSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!avatarFile) return;

    // Extra final check to ensure file is correct before uploading
    // THis should never happen as handleAvatarChange should adjust the file
    if (avatarFile.type !== 'image/webp') {
      toast.error('Invalid file type. Please upload a WebP image.');
      return;
    }
    if (avatarFile.size > 1024 * 1024 * 5) {
      toast.error('Avatar file size must be less than 5MB');
      return;
    }

    toast.promise(
      (async () => {
        // Upload the avatar to the blob storage
        const res = await fetch('/api/avatar/upload', {
          method: 'POST',
          body: avatarFile,
          headers: {
            'x-requested-by': username,
          },
        });

        // Check if upload was successful
        if (!res.ok) throw new Error('Upload failed');
        const blob = (await res.json()) as PutBlobResult;

        // Update the profile with the new avatar URL
        const updateForm = new FormData();
        updateForm.append('avatarUrl', blob.url as string);
        await updateProfile({} as ActionState, updateForm);

        setAvatarFile(null);
        setIsEdited(false);
      })(),
      {
        loading: 'Updating avatar...',
        success: 'Avatar updated successfully',
        error: 'Failed to update avatar',
      },
    );
  }

  return (
    <form onSubmit={handleAvatarSubmit} className="rounded-md bg-slate-800">
      <div className="flex flex-row space-y-4 rounded-t-md bg-slate-700 p-4">
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-2xl font-bold">Avatar</h1>
          <div className="flex flex-col">
            <p className="text-gray-400">This is your avatar.</p>
            <p className="text-gray-400">
              Click on the avatar to upload a custom one from your files.
            </p>
          </div>
        </div>
        <div className="relative">
          <input
            type="file"
            className="absolute inset-0 cursor-pointer opacity-0"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <Image
            src={avatarPreview}
            alt="Avatar"
            className="size-20 rounded-md bg-white object-cover"
            width={80}
            height={80}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-gray-400">An avatar is optional but strongly recommended.</p>
        <div className="flex flex-row gap-2">
          {isEdited && (
            <button
              type="submit"
              onClick={() => {
                setAvatarFile(null);
                setAvatarPreview(avatarUrl || '/placeholder.png');
                setIsEdited(false);
              }}
              className="cursor-pointer rounded-sm bg-slate-600 px-3 py-1 font-bold text-slate-200 hover:bg-slate-700"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="cursor-pointer rounded-sm bg-slate-200 px-3 py-1 font-bold text-slate-900 hover:bg-slate-300"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
