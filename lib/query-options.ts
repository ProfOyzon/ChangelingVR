import { getCompleteProfiles, getPosts, getUserMember, getUserProfile } from '@/lib/db/queries';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';

/**
 * Query options for fetching team profiles with React Query.
 *
 * - Uses the `fetchProfiles` function to retrieve data from the database.
 * - Keeps previous data visible during background refetches for smooth UX.
 * - Sets data as fresh for 1 hour (`staleTime`), minimizing unnecessary requests.
 * - Intended for use with React Query hooks (e.g., useQuery(profileOptions)).
 */
export const profileOptions = queryOptions({
  queryKey: ['profiles'],
  queryFn: getCompleteProfiles,
  staleTime: 60 * 60 * 1000, // 1 hour
  placeholderData: keepPreviousData,
});

export const postOptions = queryOptions({
  queryKey: ['posts'],
  queryFn: getPosts,
  staleTime: 12 * 60 * 60 * 1000, // 12 hours
  placeholderData: keepPreviousData,
});

export const memberOptions = queryOptions({
  queryKey: ['currentMember'],
  queryFn: async () => {
    const member = await getUserMember();
    const profile = await getUserProfile();
    return { member, profile };
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
  placeholderData: keepPreviousData,
});
