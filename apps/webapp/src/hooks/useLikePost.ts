import { likePost as likePostApi } from '../lib/api/likes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { useLocation, useParams } from 'react-router-dom';
import {
  BOOKMARKS,
  POST,
  POST_REPLIES,
  POSTS_FEED_FOLLOWING,
  POSTS_FEED_FORYOU,
  POSTS_PROFILE,
} from '../lib/utils/queryKeys';

export const useLikePost = () => {
  const { id } = useParams();
  const location = useLocation();

  const queryClient = useQueryClient();
  const { mutate: likePost, isPending } = useMutation({
    mutationFn: likePostApi,
    onSuccess: () => {
      if (location.pathname.startsWith('/post/') && id) {
        queryClient.invalidateQueries({ queryKey: POST(id) });
        queryClient.invalidateQueries({ queryKey: POST_REPLIES(id) });
        return;
      }
      if (location.pathname.startsWith('/profile/') && id) {
        queryClient.invalidateQueries({
          queryKey: POSTS_PROFILE(id),
        });
        return;
      }
      if (location.pathname.startsWith('/bookmarks')) {
        queryClient.invalidateQueries({ queryKey: BOOKMARKS });
        return;
      }
      queryClient.invalidateQueries({ queryKey: POSTS_FEED_FORYOU });
      queryClient.invalidateQueries({
        queryKey: POSTS_FEED_FOLLOWING,
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { likePost, isPending };
};
