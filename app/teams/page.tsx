import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import TeamsPageClient from './page.client';
import { getQueryClient } from './utils/get-query-client';
import { profileOptions } from './utils/profile-options';

export default async function TeamsPage() {
  const queryClient = getQueryClient();

  // Prefetch the data on the server
  void queryClient.prefetchQuery(profileOptions);

  return (
    <div className="min-h-svh mx-auto">
      <div className="h-16 mb-4" aria-hidden="true"></div>
      <h1 className="mb-4 text-center text-3xl font-bold md:text-5xl">Meet the Team</h1>
      <p className="mx-auto mb-6 max-w-2xl text-center text-sm md:text-base">
        The Changeling VR game and website is created by students and faculty at the Rochester
        Institute of Technology&apos;s School of Interactive Games and Media, and College of Art and
        Design.
      </p>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <TeamsPageClient />
      </HydrationBoundary>
    </div>
  );
}
