import { followUser as followUserApi } from '../lib/api/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { useLocation, useParams } from 'react-router-dom';
import { PROFILE } from '../lib/utils/queryKeys';

export const useFollow = () => {
  const { username } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { mutate: followUser, isPending } = useMutation({
    mutationFn: followUserApi,
    onSuccess: () => {
      if (location.pathname.startsWith('/profile')) {
        queryClient.invalidateQueries({
          queryKey: PROFILE(username || ''),
        });
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { followUser, isPending };
};
