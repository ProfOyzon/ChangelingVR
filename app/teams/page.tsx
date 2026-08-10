import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PaginationClient } from '@/app/teams/components/pagination-client';
import { Search } from '@/app/teams/components/search';
import { Table, TableSkeleton } from '@/app/teams/components/table';
import ErrorBoundary from '@/components/error-boundary';
import { getProfilePages } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'Meet the Team',
  description:
    "Meet the team behind the ChangelingVR game and website. We're a group of students and faculty at the Rochester Institute of Technology's School of Interactive Games and Media, and College of Art and Design.",
};

export default function Page(props: PageProps<'/teams'>) {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-4rem)] flex-col items-center gap-6 p-6 md:pt-16">
      <h1 className="text-center text-3xl font-bold md:text-5xl">Meet the Team</h1>
      <p className="mx-auto max-w-2xl text-center text-sm md:text-base">
        The ChangelingVR game and website is created by students and faculty at the Rochester
        Institute of Technology&apos;s School of Interactive Games and Media, and College of Art and
        Design.
      </p>

      <Suspense>
        <Search>
          <ErrorBoundary title="Failed to load team members.">
            <Suspense fallback={<TableSkeleton />}>
              {props.searchParams.then((sp) => {
                const { query = '', page = '1' } = sp as { query: string; page: string };
                return <SearchResults query={query} page={page} />;
              })}
            </Suspense>
          </ErrorBoundary>
        </Search>
      </Suspense>
    </div>
  );
}

export function SearchResults({ query, page }: { query: string; page: string }) {
  return (
    <>
      <Suspense fallback={<TableSkeleton />}>
        <Table query={query} page={page} />
      </Suspense>
      <Suspense>
        <Pagination query={query} />
      </Suspense>
    </>
  );
}

export async function Pagination({ query }: { query: string }) {
  const pages = await getProfilePages(query);
  return <PaginationClient totalPages={pages} />;
}
