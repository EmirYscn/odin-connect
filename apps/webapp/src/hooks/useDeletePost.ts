import { deletePost as deletePostApi } from '../lib/api/posts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export const useDeletePost = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      toast.success('Post deleted successfully!');
      queryClient.invalidateQueries({
        queryKey: ['posts'],
        exact: false,
      });

      if (id) {
        queryClient.invalidateQueries({
          queryKey: ['post', id],
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: ['replies', id],
          exact: false,
        });
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { deletePost, isPending };
};
