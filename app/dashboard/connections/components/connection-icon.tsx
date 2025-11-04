'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { addProfileLink } from '@/lib/auth/actions';
import { processFormData, processZodError, zProfileLinkSchema } from '@/lib/auth/validator';
import { cn } from '@/lib/utils';

const platformMap: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  x: 'X (formerly Twitter)',
  instagram: 'Instagram',
  email: 'Email',
  website: 'Website',
};

const platformPlaceholderMap: Record<string, string> = {
  github: 'https://github.com/yourusername',
  linkedin: 'https://linkedin.com/in/yourusername',
  x: 'https://x.com/yourusername',
  instagram: 'https://instagram.com/yourusername',
  email: 'yourname@example.com',
  website: 'https://yourwebsite.com',
};

export function ConnectionIcon({
  platform,
  icon,
  disabled,
}: {
  platform: string;
  icon: React.ReactNode;
  disabled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleConnectionAdd(formData: FormData) {
    const url = formData.get('url') as string;
    if (!url) return;

    formData.append('platform', platform);
    formData.append('visible', 'true');

    const res = zProfileLinkSchema.safeParse(processFormData(formData));
    if (!res.success) {
      toast.error(processZodError(res.error).split(';').join('\n'));
      return;
    }

    toast.promise(addProfileLink({}, formData), {
      loading: `Adding ${platformMap[platform]} link...`,
      success: `${platformMap[platform]} link added successfully`,
      error: `Failed to add ${platformMap[platform]} link`,
    });

    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        title={platformMap[platform]}
        aria-label={platformMap[platform]}
        aria-disabled={disabled}
        className={cn(
          'cursor-pointer rounded-md border border-gray-500/50 p-2',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        disabled={disabled}
        onClick={() => setIsOpen(true)}
      >
        <span className="sr-only">{platformMap[platform]}</span>
        {icon}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/50 px-4">
          <form
            action={handleConnectionAdd}
            className="mx-auto w-full max-w-sm space-y-6 rounded-md border border-gray-500/50 bg-slate-900 p-4"
          >
            <div className="flex flex-col">
              <h2 className="text-xl font-bold">{platformMap[platform]}</h2>
              <p className="text-sm text-gray-400">
                Add your {platformMap[platform]} to your profile.
              </p>
            </div>

            <input
              type="text"
              name="url"
              placeholder={platformPlaceholderMap[platform]}
              className="w-full rounded-md border border-gray-500/50 p-2"
            />

            <div className="flex flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-md bg-gray-500 px-3 py-1 text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="cursor-pointer rounded-md bg-blue-500 px-3 py-1 text-white"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
