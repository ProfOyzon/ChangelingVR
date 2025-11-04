'use client';

import { toast } from 'sonner';
import { updateProfile } from '@/lib/auth/actions';
import { processFormData, processZodError, zUsernameSchema } from '@/lib/auth/validator';

export function UsernameSection({ username }: { username: string }) {
  async function handleUsernameSubmit(formData: FormData) {
    // Only update if new username is different from the current username
    const newUsername = formData.get('username') as string;
    if (newUsername === username) return;

    // Initial validation
    const result = zUsernameSchema.safeParse(processFormData(formData));
    if (!result.success) {
      toast.error(processZodError(result.error).split(';').join('\n'));
      return;
    }

    // Update the username
    toast.promise(updateProfile(result.data, formData), {
      loading: 'Updating username...',
      success: 'Username updated successfully',
      error: 'Failed to update username',
    });
  }

  return (
    <form action={handleUsernameSubmit} className="rounded-md bg-slate-800">
      <div className="space-y-4 rounded-t-md bg-slate-700 p-4">
        <h1 className="text-2xl font-bold">Username</h1>
        <p className="text-gray-400">This is your URL namespace within Changeling VR.</p>

        <div className="flex items-center">
          <span className="rounded-l-md border border-gray-500/50 bg-slate-700 p-2 text-gray-400">
            changelingvr.com/users/
          </span>
          <input
            type="text"
            name="username"
            minLength={3}
            maxLength={15}
            defaultValue={username}
            placeholder="Username"
            className="min-w-1/4 rounded-r-md border border-l-0 border-gray-500/50 bg-slate-600 p-2"
          />
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-gray-400">Please use 15 characters at maximum.</p>
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
