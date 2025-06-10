import { getUserProfile } from '@/lib/db/queries';
import { useQuery } from '@tanstack/react-query';

export function useProfileQuery() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
    staleTime: 0,
    gcTime: 0,
    meta: {
      tags: ['profile'],
    },
  });
}
