import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createPost as createPostApi } from '../lib/api/posts';
import { useParams } from 'react-router-dom';

export const useCreatePost = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();
  const { mutate: createPost, isPending } = useMutation({
    mutationFn: createPostApi,
    onSuccess: () => {
      toast.success('Post created successfully!');
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

  return { createPost, isPending };
};
