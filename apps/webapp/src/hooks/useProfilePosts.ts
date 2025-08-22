import { getProfilePosts } from '../lib/api/posts';
import { useQuery } from '@tanstack/react-query';
import { PROFILE_POSTS } from '../lib/utils/queryKeys';

export const useProfilePosts = (username: string) => {
  const { data, isLoading } = useQuery({
    queryKey: PROFILE_POSTS(username),
    queryFn: async () => getProfilePosts(username),
    enabled: !!username,
  });

  return {
    userPosts: data,
    isLoading,
  };
};
