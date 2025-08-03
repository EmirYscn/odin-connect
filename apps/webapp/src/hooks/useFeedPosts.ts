import { getFollowingPosts, getForYouPosts } from '../lib/api/posts';
import { useQuery } from '@tanstack/react-query';

export const useFeedPosts = (context: 'foryou' | 'following') => {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'feed', context],
    queryFn: context === 'foryou' ? getForYouPosts : getFollowingPosts,
  });

  return {
    feedPosts: data,
    isLoading,
  };
};
