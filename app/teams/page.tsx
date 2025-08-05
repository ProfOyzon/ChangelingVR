import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Pagination } from '@/app/_components/teams/pagination';
import { Search } from '@/app/_components/teams/search';
import { Table, TableSkeleton } from '@/app/_components/teams/table';
import { getProfilePages } from '@/lib/db/queries';

export const metadata: Metadata = {
  title: 'Meet the Team',
  description:
    "Meet the team behind the Changeling VR game and website. We're a group of students and faculty at the Rochester Institute of Technology's School of Interactive Games and Media, and College of Art and Design.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query: string; page: string }>;
}) {
  const params = await searchParams;
  const { query = '', page = '1' } = params;
  const totalPages = await getProfilePages(query);

  return (
    <div className="mx-auto my-4 flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center gap-6 max-md:p-6">
      <h1 className="text-center text-3xl font-bold md:text-5xl">Meet the Team</h1>
      <p className="mx-auto max-w-2xl text-center text-sm md:text-base">
        The Changeling VR game and website is created by students and faculty at the Rochester
        Institute of Technology&apos;s School of Interactive Games and Media, and College of Art and
        Design.
      </p>

      <Search placeholder="Search for a team member" />

      <Suspense fallback={<TableSkeleton />}>
        <Table query={query} page={page} />
      </Suspense>

      <Pagination totalPages={totalPages} />
    </div>
  );
}
