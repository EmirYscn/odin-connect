import { getProfile } from '../lib/api/profile';
import { useQuery } from '@tanstack/react-query';

export const useProfile = (id: string) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => getProfile(id),
    enabled: !!id,
  });

  return { profile, isLoading };
};
