'use client';

import { toast } from 'sonner';
import { updateProfile } from '@/lib/auth/actions';
import { processFormData, processZodError, zBioSchema } from '@/lib/auth/validator';

export function AboutMeSection({ bio }: { bio: string }) {
  async function handleBioSubmit(formData: FormData) {
    // Only update if new bio is different from the current bio
    const newBio = (formData.get('bio') as string) || '';
    if (newBio === bio) return;

    // Validate form data
    const result = zBioSchema.safeParse(processFormData(formData));
    if (!result.success) {
      toast.error(processZodError(result.error).split(';').join('\n'));
      return;
    }

    // Update the bio
    toast.promise(updateProfile(result.data, formData), {
      loading: 'Updating bio...',
      success: 'Bio updated successfully',
      error: 'Failed to update bio',
    });
  }

  return (
    <form action={handleBioSubmit} className="rounded-md bg-slate-800">
      <div className="space-y-4 rounded-t-md bg-slate-700 p-4">
        <h1 className="text-2xl font-bold">About Me</h1>
        <textarea
          name="bio"
          maxLength={500}
          defaultValue={bio}
          placeholder="Share your role and experience working on Changeling VR..."
          rows={4}
          className="field-sizing-content w-full resize-none rounded-md border border-gray-500/50 bg-slate-600 p-2"
        />
        <p className="text-sm text-gray-400">
          Markdown is supported via Remark GFM.{' '}
          <a
            href="https://github.com/remarkjs/remark-gfm?tab=readme-ov-file#use"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-500 hover:underline"
          >
            Read more.
          </a>
        </p>
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-gray-400">Please use 500 characters at maximum.</p>
        <button
          type="submit"
          className="cursor-pointer rounded-sm bg-slate-200 px-3 py-1 font-bold text-slate-900 hover:bg-slate-300"
        >
          Save
        </button>
      </div>
    </form>
  );
}
