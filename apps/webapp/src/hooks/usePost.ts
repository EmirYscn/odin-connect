import { getPost } from '../lib/api/posts';
import { useQuery } from '@tanstack/react-query';
import { POST } from '../lib/utils/queryKeys';

export const usePost = (id: string) => {
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: POST(id),
    queryFn: async () => getPost(id),
    enabled: !!id,
  });

  return { post, isLoading, error };
};
