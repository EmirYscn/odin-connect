import { Post as PostType } from '@odin-connect-monorepo/types';
import Post from '../../components/Post';
import { useBookmarks } from '../../hooks/useBookmarks';
import Button from '../../components/Button';
import SpinnerMini from '../../components/SpinnerMini';
import PostSkeleton from '../../components/PostSkeleton';
import BackButton from '../../components/BackButton';

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
      <div className="flex items-center gap-2 py-4 sticky top-0 z-10 backdrop-blur-md bg-[var(--color-grey-50)]/10 rounded-bl-md rounded-br-md">
        <BackButton navigateTo="/home" />
        <span className="text-xl font-semibold text-[var(--color-grey-700)]/90">
          Bookmarks
        </span>
      </div>
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
