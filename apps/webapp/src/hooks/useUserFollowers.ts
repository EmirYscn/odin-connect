import { useQuery } from '@tanstack/react-query';
import { getUserFollowers } from '../lib/api/users';
import { PROFILE_FOLLOWERS } from '../lib/utils/queryKeys';

export const useUserFollowers = (username: string) => {
  const { data: followers, isLoading } = useQuery({
    queryKey: PROFILE_FOLLOWERS(username),
    queryFn: () => getUserFollowers(username),
  });

  return { followers, isLoading };
};
