import { getProfile } from '../lib/api/profile';
import { useQuery } from '@tanstack/react-query';
import { PROFILE } from '../lib/utils/queryKeys';

export const useProfile = (username: string) => {
  const { data: profile, isLoading } = useQuery({
    queryKey: PROFILE(username),
    queryFn: async () => getProfile(username),
    enabled: !!username,
  });

  return { profile, isLoading };
};
