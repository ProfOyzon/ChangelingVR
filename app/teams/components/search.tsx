'use client';

import { useId, useRef, useTransition } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useShortcutListener } from '@/app/teams/hooks/use-shortcut-listener';
import { useSyncInputToParam } from '@/app/teams/hooks/use-sync-input-to-param';
import { SeedFromParam } from '@/app/teams/scripts/seed-from-param';

export function Search({ children }: { children: React.ReactNode }) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useSyncInputToParam(inputRef, 'query');
  useShortcutListener(inputRef);

  const handleSearch = useDebouncedCallback((value: string) => {
    startTransition(() => {
      router.replace(value ? `/teams?query=${encodeURIComponent(value)}` : '/teams', {
        scroll: false,
      });
    });
  }, 250);

  return (
    <>
      <div className="relative w-full max-w-xs">
        <input
          id={inputId}
          ref={inputRef}
          name="query"
          placeholder="Search for a team member"
          suppressHydrationWarning
          className="block w-full rounded-md border border-gray-200 py-2.25 pl-10 text-sm outline-2 placeholder:text-gray-500"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
        />
        <FaMagnifyingGlass className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-500" />
      </div>
      <SeedFromParam targetId={inputId} param="query" />
      <div
        data-pending={isPending ? '' : undefined}
        className="w-full transition-opacity duration-200 ease-out data-pending:opacity-60"
      >
        {children}
      </div>
    </>
  );
}
