import { deletePost as deletePostApi } from '../lib/api/posts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { useLocation, useParams } from 'react-router-dom';
import { POST, POST_REPLIES } from '../lib/utils/queryKeys';

export const useDeletePost = () => {
  const { id } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: deletePostApi,
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

      toast('Post deleted');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { deletePost, isPending };
};
