'use client';

import { useTransition } from 'react';
import {
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from 'react-icons/fa6';
import { toast } from 'sonner';
import { deleteProfileLink, updateProfileLink } from '@/lib/auth/actions';
import type { ProfileLink } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

const platformMap: Record<string, React.ReactNode> = {
  github: <FaGithub className="size-6" />,
  linkedin: <FaLinkedin className="size-6" />,
  x: <FaXTwitter className="size-6" />,
  instagram: <FaInstagram className="size-6" />,
  email: <FaEnvelope className="size-6" />,
  website: <FaGlobe className="size-6" />,
};

export function ConnectionCard({ connection }: { connection: Omit<ProfileLink, 'uuid'> }) {
  const [isPending, startTransition] = useTransition();

  // Helper variables
  const isVisible = connection.visible;
  const capitalizedPlatform =
    connection.platform.charAt(0).toUpperCase() + connection.platform.slice(1);

  // Form data for the delete and visibility toggle actions
  const formData = new FormData();
  formData.append('platform', connection.platform);
  formData.append('url', connection.url);
  formData.append('visible', String(!isVisible));

  // Handle the delete action
  function handleDelete() {
    startTransition(async () => {
      toast.promise(deleteProfileLink({}, formData), {
        loading: `Deleting ${capitalizedPlatform} link...`,
        success: `${capitalizedPlatform} link deleted successfully`,
        error: `Failed to delete ${capitalizedPlatform} link`,
      });
    });
  }

  // Handle the visibility toggle action
  function handleVisibilityToggle() {
    startTransition(async () => {
      toast.promise(updateProfileLink({}, formData), {
        loading: `Updating ${capitalizedPlatform} visibility...`,
        success: `${capitalizedPlatform} ${isVisible ? 'hidden from' : 'displayed to'} profile.`,
        error: `Failed to ${isVisible ? 'hide' : 'show'} ${capitalizedPlatform} on profile.`,
      });
    });
  }

  return (
    <div className="relative flex flex-col gap-6 rounded-md border border-gray-500/50 bg-slate-800 p-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex w-full flex-row items-center gap-4">
          {platformMap[connection.platform]}
          <div className="flex w-full flex-col">
            <input type="text" name="url" value={connection.url} className="font-bold" readOnly />
            <input
              type="text"
              name="platform"
              value={connection.platform}
              className="text-sm text-gray-400 capitalize"
              readOnly
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="cursor-pointer rounded-sm bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>

      <div className="flex flex-row items-center justify-between">
        <p className="font-medium text-gray-200">Display on profile</p>
        <button
          type="button"
          onClick={handleVisibilityToggle}
          disabled={isPending}
          className={cn(
            'relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 ease-in-out',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isVisible ? 'bg-light-mustard' : 'bg-gray-500/50',
          )}
          aria-label={isVisible ? 'Hide on profile' : 'Show on profile'}
          aria-pressed={isVisible}
        >
          <span
            className={cn(
              'inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out',
              isVisible ? 'translate-x-5' : 'translate-x-0',
            )}
          />
        </button>
      </div>
    </div>
  );
}
