'use client';

import { useState } from 'react';
import { FaUserPen } from 'react-icons/fa6';
import Image from 'next/image';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/supabase/dropzone';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSupabaseUpload } from '@/hooks/use-supabase-upload';

interface EditProfileDialogProps {
  currentImage: string;
  userId: string;
}

export function EditProfileDialog({ currentImage, userId }: EditProfileDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const uploadProps = useSupabaseUpload({
    bucketName: 'avatars',
    name: String(userId), // Ensure the name is a string
    allowedMimeTypes: ['image/*'],
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    upsert: true,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="hover:midnight group relative h-[128px] w-[128px] cursor-pointer rounded">
          <Image
            src={currentImage || '/placeholder.png'}
            width={128}
            height={128}
            alt="Profile picture"
            className="rounded object-cover"
          />

          {/* Small edit button */}
          <div className="bg-midnight/80 absolute top-2 right-2 rounded-full p-1 transition-opacity group-hover:opacity-0">
            <FaUserPen className="size-4 text-white" />
          </div>

          {/* Full overlay edit button */}
          <div className="bg-midnight/80 absolute inset-0 flex items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100">
            <FaUserPen className="size-6 text-white" />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile Picture</DialogTitle>
          <DialogDescription>Upload a new profile picture. Max file size: 5MB</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Dropzone {...uploadProps}>
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
