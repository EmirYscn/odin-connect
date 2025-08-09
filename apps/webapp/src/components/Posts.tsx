import Post from './Post';
import PostSkeleton from './PostSkeleton';
import { HiOutlineInbox } from 'react-icons/hi2';
import { Post as PostType } from '@odin-connect-monorepo/types';

type PostsProps = {
  posts: PostType[] | undefined;
  isLoading?: boolean;
  context?: 'feed' | 'profile' | 'profile_replies' | 'postReplies';
};

const noPostMessages = {
  feed: 'Looks like your feed is empty. Start by creating a new post or follow others to see their updates!',
  profile: 'This user has no posts yet.',
  profile_replies: 'This user has not replied to any posts yet.',
  postReplies: 'No replies yet. Be the first to reply!',
};

function Posts({ posts, isLoading, context = 'feed' }: PostsProps) {
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
    <div className="w-full flex flex-col">
      {posts && posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <div className="flex flex-col items-center justify-center py-16 opacity-70">
          <HiOutlineInbox className="w-16 h-16 text-[var(--color-grey-600)] mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-grey-700)] mb-2">
            No posts yet
          </h2>
          <p className="text-[var(--color-grey-600)] text-center max-w-xs">
            {noPostMessages[context]}
          </p>
        </div>
      )}
    </div>
  );
}

export default Posts;
