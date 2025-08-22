import { useQuery } from '@tanstack/react-query';
import { getUserFollowing } from '../lib/api/users';
import { PROFILE_FOLLOWING } from '../lib/utils/queryKeys';

export const useUserFollowing = (username: string) => {
  const { data: following, isLoading } = useQuery({
    queryKey: PROFILE_FOLLOWING(username),
    queryFn: () => getUserFollowing(username),
  });

  return { following, isLoading };
};
