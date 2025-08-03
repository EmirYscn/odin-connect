import { getProfilePosts } from '../lib/api/posts';
import { useQuery } from '@tanstack/react-query';

export const useProfilePosts = (profileId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'profile', profileId],
    queryFn: async () => getProfilePosts(profileId),
    enabled: !!profileId,
  });

  return {
    userPosts: data,
    isLoading,
  };
};
