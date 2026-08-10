'use client';

import { useState } from 'react';
import { PutBlobResult } from '@vercel/blob';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
  const router = useRouter();

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

    // Extra check to ensure file is correct before uploading
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
        const res = await fetch('/api/avatar', {
          method: 'POST',
          body: avatarFile,
        });

        if (!res.ok) throw new Error('Upload failed');
        const blob = (await res.json()) as PutBlobResult;

        setIsEdited(false);
        setAvatarFile(null);
        setAvatarPreview(blob.url);
        router.refresh();
      })(),
      {
        loading: 'Updating avatar...',
        success: 'Avatar updated successfully',
        error: 'Failed to update avatar',
      },
    );
  }

  async function handleAvatarDelete(e: React.FormEvent) {
    e.preventDefault();

    toast.promise(
      (async () => {
        const res = await fetch('/api/avatar', {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete avatar');
        setIsEdited(false);
        setAvatarFile(null);
        setAvatarPreview('/placeholder.png');
        router.refresh();
      })(),
      {
        loading: 'Removing avatar...',
        success: 'Avatar removed successfully',
        error: 'Failed to delete avatar',
      },
    );
  }

  return (
    <form onSubmit={handleAvatarSubmit} className="rounded-md bg-slate-800">
      <div className="flex flex-row rounded-t-md bg-slate-700 p-6">
        <div className="flex flex-1 flex-col gap-4">
          <h1 className="text-2xl font-bold">Avatar</h1>
          <div className="flex max-w-3/4 flex-col">
            <p className="text-gray-400">
              Click on the avatar to upload a custom one from your files. We recommend using a
              square image and verifying the preview before saving.
            </p>
          </div>
        </div>
        <div className="group relative">
          <input
            type="file"
            className="absolute inset-0 z-10 cursor-pointer opacity-0"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <Image
            src={avatarPreview}
            alt="Avatar"
            className="size-20 rounded-md bg-white object-cover group-hover:opacity-80"
            width={80}
            height={80}
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-gray-400">An avatar is optional but strongly recommended.</p>
        <div className="flex flex-row items-center gap-2">
          {avatarUrl && !isEdited && (
            <button
              type="button"
              onClick={handleAvatarDelete}
              className="cursor-pointer rounded-sm bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
            >
              Remove Avatar
            </button>
          )}
          {isEdited && (
            <button
              type="button"
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
