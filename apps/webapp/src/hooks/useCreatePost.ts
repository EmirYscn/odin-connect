import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createPost as createPostApi } from '../lib/api/posts';
import { useLocation, useParams } from 'react-router-dom';
import { POST, POST_REPLIES } from '../lib/utils/queryKeys';

export const useCreatePost = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: createPostApi,
    onSuccess: () => {
      if (location.pathname.startsWith('/post/') && id) {
        queryClient.invalidateQueries({ queryKey: POST(id) });
        queryClient.invalidateQueries({ queryKey: POST_REPLIES(id) });
        return;
      }
      queryClient.invalidateQueries({
        queryKey: ['posts'],
        exact: false,
      });
      toast('Post created');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { createPost, isPending };
};
