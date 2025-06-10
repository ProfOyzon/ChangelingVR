import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getQueryClient } from '@/lib/get-query-client';
import { profileOptions } from '@/lib/query-options';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import TeamsPageClient from './page.client';

function Loading() {
  return (
    <div className="mb-6 flex flex-wrap justify-center gap-6">
      {[...Array(20)].map((_, index) => (
        <div
          key={index}
          className="bg-steel/50 mx-auto h-64 w-40 max-w-40 min-w-40 animate-pulse rounded backdrop-blur-sm"
        >
          <div className="bg-steel/50 h-40 w-full rounded backdrop-blur-sm"></div>
          <div className="w-full space-y-1 p-2">
            <div className="bg-steel/50 h-4 rounded backdrop-blur-sm"></div>
            <div className="bg-steel/50 h-10 rounded backdrop-blur-sm"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const metadata: Metadata = {
  title: 'Meet the Team',
  description:
    "Meet the team behind the Changeling VR game and website. We're a group of students and faculty at the Rochester Institute of Technology's School of Interactive Games and Media, and College of Art and Design.",
};

export default async function TeamsPage() {
  // Prefetch the data on the server
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(profileOptions);

  return (
    <div className="mx-auto p-6">
      <h1 className="mb-4 text-center text-3xl font-bold md:text-5xl">Meet the Team</h1>
      <p className="mx-auto mb-6 max-w-2xl text-center text-sm md:text-base">
        The Changeling VR game and website is created by students and faculty at the Rochester
        Institute of Technology&apos;s School of Interactive Games and Media, and College of Art and
        Design.
      </p>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<Loading />}>
          <TeamsPageClient />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}
