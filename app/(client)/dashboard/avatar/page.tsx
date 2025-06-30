'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useProfileQuery } from '@/hooks/use-profile';
import { resizeAndConvertToWebP } from '@/lib/process-avatar';
import { cn } from '@/lib/utils';
import type { PutBlobResult } from '@vercel/blob';

const AvatarDropzone = ({
  onUpload,
  isProcessing,
  className,
}: {
  onUpload: (file: File) => Promise<void>;
  isProcessing: boolean;
  className?: string;
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        await onUpload(file);
      }
    },
    [onUpload],
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await onUpload(file);
      }
    },
    [onUpload],
  );

  return (
    <div
      className={cn(
        'rounded-md border-2 border-dashed p-6 text-center transition-colors duration-300',
        isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25',
        className,
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
        onChange={handleFileSelect}
      />
      <div className="flex flex-col items-center gap-2">
        <Upload className="text-muted-foreground h-8 w-8" />
        <p className="text-muted-foreground text-sm">
          Drag and drop your avatar here or{' '}
          <Button
            variant="link"
            className="h-auto p-0 font-normal"
            onClick={() => inputRef.current?.click()}
            disabled={isProcessing}
          >
            browse
          </Button>
        </p>
        <p className="text-muted-foreground text-xs">Supports JPG, PNG, and WebP up to 4.5MB</p>
      </div>
    </div>
  );
};

export default function AvatarPage() {
  const { data, isLoading, error } = useProfileQuery();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (data) {
      setAvatar(data.avatar_url);
    }
  }, [data]);

  const handleUpload = async (file: File) => {
    setIsProcessing(true);
    await toast.promise(
      (async () => {
        const processedBlob = await resizeAndConvertToWebP(file);
        if (processedBlob.size > 4.5 * 1024 * 1024) {
          throw new Error('File size exceeds 4.5MB');
        }

        const response = await fetch(`/api/avatar/upload?filename=${data?.uuid}.webp`, {
          method: 'POST',
          body: processedBlob,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to upload avatar');
        }

        const newBlob = (await response.json()) as PutBlobResult;
        setAvatar(newBlob.url);
      })(),
      {
        loading: 'Uploading avatar...',
        success: 'Avatar updated successfully',
        error: (err) => err.message || 'Failed to upload avatar',
      },
    );
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">Error loading profile</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-muted-foreground text-sm">This will be moved into the settings page</p>
        <p className="text-muted-foreground text-sm">
          This is a temporary page to upload an avatar for the user.
        </p>
      </div>
      {avatar && (
        <div className="relative h-32 w-32 overflow-hidden rounded border">
          <Image src={avatar} alt="Avatar" fill className="object-cover" sizes="128px" />
        </div>
      )}
      <AvatarDropzone
        onUpload={handleUpload}
        isProcessing={isProcessing}
        className="w-full max-w-md"
      />
    </div>
  );
}
