'use client';

import { toast } from 'sonner';
import { updateProfile } from '@/lib/actions/update-profile';
import { processFormData, processZodError, zDisplayNameSchema } from '@/lib/auth/validator';

export function DisplayNameSection({ displayName }: { displayName: string }) {
  async function handleDisplayNameSubmit(formData: FormData) {
    // Only update if new display name is different from the current display name
    const newDisplayName = formData.get('displayName') as string;
    if (newDisplayName === displayName) return;

    // Initial validation
    const result = zDisplayNameSchema.safeParse(processFormData(formData));
    if (!result.success) {
      toast.error(processZodError(result.error).split(';').join('\n'));
      return;
    }

    // Update the display name
    toast.promise(updateProfile(result.data, formData), {
      loading: 'Updating display name...',
      success: 'Display name updated successfully',
      error: (err) => {
        return err instanceof Error ? err.message : 'Failed to update display name';
      },
    });
  }

  return (
    <form action={handleDisplayNameSubmit} className="rounded-md bg-slate-800">
      <div className="space-y-4 rounded-t-md bg-slate-700 p-6">
        <h1 className="text-2xl font-bold">Display Name</h1>
        <p className="text-gray-400">
          This is your public name within ChangelingVR. We recommend using your full name or a
          recognizable alias.
        </p>

        <input
          type="text"
          name="displayName"
          maxLength={50}
          defaultValue={displayName}
          placeholder="Enter your display name"
          className="min-w-1/3 rounded-md border border-gray-500/50 bg-slate-600 p-2"
        />
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-gray-400">Please use 50 characters at maximum.</p>
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
