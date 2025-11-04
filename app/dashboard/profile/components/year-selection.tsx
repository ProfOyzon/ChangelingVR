'use client';

import { toast } from 'sonner';
import { updateProfile } from '@/lib/auth/actions';
import { processFormData, processZodError, zUpdateProfileSchema } from '@/lib/auth/validator';

const YEARS = [...Array(new Date().getFullYear() - 2019)]
  .map((_, i) => new Date().getFullYear() - i)
  .sort();

export function YearSelection({ years }: { years: number[] }) {
  const selectedYears = new Set(years ?? []);

  async function handleYearSubmit(formData: FormData) {
    const newYears = formData.getAll('terms') as string[];
    if (newYears.length === 0) {
      formData.set('terms', '__EMPTY__');
    }

    const result = zUpdateProfileSchema.safeParse(processFormData(formData));
    if (!result.success) {
      toast.error(processZodError(result.error).split(';').join('\n'));
      return;
    }

    toast.promise(updateProfile(result.data, formData), {
      loading: 'Updating years...',
      success: 'Years updated successfully',
      error: 'Failed to update years',
    });
  }

  return (
    <form action={handleYearSubmit} className="rounded-md bg-slate-800">
      <div className="space-y-4 rounded-t-md bg-slate-700 p-4">
        <h1 className="text-2xl font-bold">Year Selection</h1>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {YEARS.map((y) => (
            <div
              key={y}
              className="flex w-full items-center gap-2 rounded-md border border-slate-600/60 bg-slate-600 px-3 py-2"
            >
              <input
                id={y.toString()}
                type="checkbox"
                name="terms"
                value={y}
                defaultChecked={selectedYears.has(y)}
                className="size-4 cursor-pointer rounded border-slate-500 bg-slate-900 text-sky-500 focus:ring-2 focus:ring-sky-500"
              />
              <label htmlFor={y.toString()} className="cursor-pointer select-none">
                {y}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-gray-400">Select one or more years (or none).</p>
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
