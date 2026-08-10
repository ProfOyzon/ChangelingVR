'use client';

import { type ErrorInfo, catchError } from 'next/error';
import { RotateCcw, TriangleAlert } from 'lucide-react';

// This can be slotted anywhere where a fetch or other async operation is being performed
// It will catch any errors and display the following fallback UI

function ErrorFallback(props: { title: string }, { retry }: ErrorInfo) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      className="mx-auto flex min-h-48 w-[75%] flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-6 text-center text-slate-900 shadow-sm"
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-red-100 text-red-600">
        <TriangleAlert className="size-6" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-semibold">{props.title}</h2>
        <p className="text-sm text-slate-600">We couldn&apos;t load this part of the page.</p>
      </div>

      <button
        type="button"
        onClick={() => retry()}
        className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Try again
      </button>
    </section>
  );
}

export default catchError(ErrorFallback);
