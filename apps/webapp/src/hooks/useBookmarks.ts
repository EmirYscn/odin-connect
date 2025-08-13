import { useInfiniteQuery } from '@tanstack/react-query';
import { getBookmarks } from '../lib/api/bookmarks';

export const useBookmarks = () => {
  const {
    data: bookmarks,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['bookmarks'],
    queryFn: ({ pageParam }: { pageParam?: string }) => getBookmarks(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const flatBookmarks = bookmarks?.pages.flatMap((page) => page.bookmarks);

  return {
    bookmarks: flatBookmarks,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  };
};
