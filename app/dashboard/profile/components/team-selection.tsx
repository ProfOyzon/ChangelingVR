'use client';

import { toast } from 'sonner';
import { updateProfile } from '@/lib/auth/actions';
import { processFormData, processZodError, zUpdateProfileSchema } from '@/lib/auth/validator';

const TEAMS = [
  'Development',
  'Art',
  'Tech Art',
  'Audio',
  'Web',
  'Narrative',
  'Voice',
  'Production',
].sort();

export function TeamSelection({ teams }: { teams: string[] }) {
  const normalizedTeams = new Set((teams ?? []).map((t) => t.toLowerCase()));

  async function handleTeamSubmit(formData: FormData) {
    const newTeams = formData.getAll('teams') as string[];
    if (newTeams.length === 0) {
      formData.set('teams', '__EMPTY__');
    }

    const result = zUpdateProfileSchema.safeParse(processFormData(formData));
    if (!result.success) {
      toast.error(processZodError(result.error).split(';').join('\n'));
      return;
    }

    toast.promise(updateProfile(result.data, formData), {
      loading: 'Updating teams...',
      success: 'Teams updated successfully',
      error: 'Failed to update teams',
    });
  }

  return (
    <form action={handleTeamSubmit} className="rounded-md bg-slate-800">
      <div className="space-y-4 rounded-t-md bg-slate-700 p-4">
        <h1 className="text-2xl font-bold">Team Selection</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {TEAMS.map((t) => (
            <div
              key={t}
              className="flex w-full items-center gap-2 rounded-md border border-slate-600/60 bg-slate-600 px-3 py-2"
            >
              <input
                id={t}
                type="checkbox"
                name="teams"
                value={t}
                defaultChecked={normalizedTeams.has(t.toLowerCase())}
                className="size-4 cursor-pointer rounded border-slate-500 bg-slate-900 text-sky-500 focus:ring-2 focus:ring-sky-500"
              />
              <label htmlFor={t} className="cursor-pointer select-none">
                {t}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-gray-400">Please select at least one team.</p>
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
