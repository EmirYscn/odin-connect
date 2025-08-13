import { getReplies } from '../lib/api/posts';
import { useQuery } from '@tanstack/react-query';

export const useReplies = (postId: string) => {
  const { data: replies, isLoading } = useQuery({
    queryKey: ['post', 'replies', postId],
    queryFn: () => getReplies(postId),
    enabled: !!postId,
  });

  return { replies, isLoading };
};
