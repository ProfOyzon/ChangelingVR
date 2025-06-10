import { updateProfile } from '@/lib/auth/actions';
import type { ActionState } from '@/lib/auth/middleware';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => updateProfile({} as ActionState, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
