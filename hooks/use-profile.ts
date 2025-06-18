import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateProfile } from '../lib/auth/actions';
import type { ActionState } from '../lib/auth/middleware';
import { getUserProfile } from '../lib/db/queries';

export function useProfileQuery() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: getUserProfile,
    staleTime: 0,
    gcTime: 0,
    meta: {
      tags: ['profiles'],
    },
  });
}

export function useProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => updateProfile({} as ActionState, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}
