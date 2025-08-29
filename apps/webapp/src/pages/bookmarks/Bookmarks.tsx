import { Post as PostType } from '@odin-connect-monorepo/types';
import Post from '../../components/Post';
import { useBookmarks } from '../../hooks/useBookmarks';
import Button from '../../components/Button';
import SpinnerMini from '../../components/SpinnerMini';
import PostSkeleton from '../../components/PostSkeleton';
import PageHeader from '../../components/PageHeader';

function Bookmarks() {
  const {
    bookmarks,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useBookmarks();

  if (isLoading) {
    return (
      <>
        <PostSkeleton />
        <PostSkeleton />
        <PostSkeleton />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader text="Bookmarks" />
      {bookmarks?.map((bookmark) => (
        <Post
          key={bookmark.id}
          post={bookmark.post as PostType}
          isLoading={isLoading}
        />
      ))}
      {hasNextPage && (
        <Button
          variation="loadMore"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <span className="flex items-center gap-2">
              <SpinnerMini />
              Loading...
            </span>
          ) : (
            'Load More'
          )}
        </Button>
      )}
    </div>
  );
}

export default Bookmarks;
