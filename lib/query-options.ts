import { getAllProfiles } from '@/lib/db/queries';
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
  queryFn: getAllProfiles,
  staleTime: 60 * 60 * 1000, // 1 hour
  placeholderData: keepPreviousData,
});
