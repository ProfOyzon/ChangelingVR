'use client';

import { toast } from 'sonner';
import { updateProfile } from '@/lib/auth/actions';
import { processFormData, processZodError, zRolesSchema } from '@/lib/auth/validator';

const ROLES = [
  'Programmer',
  'Level Designer',
  'UI/UX Designer',
  'Writer',
  'Voice Actor',
  '2D Artist',
  '3D Modeler',
  'Tech Artist',
  'Concept Artist',
  'Sound Designer',
  'Composer',
  'Producer',
  'Lead',
].sort();

export function RoleSelection({ roles }: { roles: string[] }) {
  // Normalize the roles to lowercase
  const normalizedRoles = new Set((roles ?? []).map((r) => r.toLowerCase()));

  async function handleRoleSubmit(formData: FormData) {
    const newRoles = formData.getAll('roles') as string[];
    if (newRoles.length === 0) {
      // Signal to clear roles in the server action
      formData.set('roles', '__EMPTY__');
    }
    if (newRoles === roles) return;

    const result = zRolesSchema.safeParse(processFormData(formData));
    if (!result.success) {
      toast.error(processZodError(result.error).split(';').join('\n'));
      return;
    }

    toast.promise(updateProfile(result.data, formData), {
      loading: 'Updating roles...',
      success: 'Roles updated successfully',
      error: 'Failed to update roles',
    });
  }

  return (
    <form action={handleRoleSubmit} className="rounded-md bg-slate-800">
      <div className="space-y-4 rounded-t-md bg-slate-700 p-4">
        <h1 className="text-2xl font-bold">Role Selection</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {ROLES.map((r) => (
            <div
              key={r}
              className="flex w-full items-center gap-2 rounded-md border border-slate-600/60 bg-slate-600 px-3 py-2"
            >
              <input
                id={r}
                type="checkbox"
                name="roles"
                value={r}
                defaultChecked={normalizedRoles.has(r.toLowerCase())}
                className="size-4 cursor-pointer rounded border-slate-500 bg-slate-900 text-sky-500 focus:ring-2 focus:ring-sky-500"
              />
              <label htmlFor={r} className="cursor-pointer select-none">
                {r}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-gray-400">Please select at least one role.</p>
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
