import { repostPost as repostPostApi } from '../lib/api/posts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export const useRepostPost = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const { mutate: repostPost, isPending } = useMutation({
    mutationFn: repostPostApi,
    onSuccess: () => {
      if (id) {
        queryClient.invalidateQueries({
          queryKey: ['post', id],
        });
        queryClient.invalidateQueries({
          queryKey: ['replies'],
        });
        return;
      }
      queryClient.invalidateQueries({
        queryKey: ['posts'],
        exact: false,
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { repostPost, isPending };
};
