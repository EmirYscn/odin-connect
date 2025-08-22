import { getProfileReplies } from '../lib/api/posts';
import { useQuery } from '@tanstack/react-query';
import { PROFILE_REPLIES } from '../lib/utils/queryKeys';

export const useProfileReplies = (username: string) => {
  const { data, isLoading } = useQuery({
    queryKey: PROFILE_REPLIES(username),
    queryFn: async () => getProfileReplies(username),
    enabled: !!username,
  });

  return {
    replies: data,
    isLoading,
  };
};
