import { getPost } from '../lib/api/posts';
import { useQuery } from '@tanstack/react-query';

export const usePost = (id: string) => {
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => getPost(id),
    enabled: !!id,
  });

  return { post, isLoading, error };
};
