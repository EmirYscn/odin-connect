import { getProfileReplies } from '../lib/api/posts';
import { useQuery } from '@tanstack/react-query';

export const useProfileReplies = (profileId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['replies', 'profile', profileId],
    queryFn: async () => getProfileReplies(profileId),
    enabled: !!profileId,
  });

  return {
    replies: data,
    isLoading,
  };
};
