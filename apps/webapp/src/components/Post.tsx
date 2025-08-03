import { Post as PostType } from '@odin-connect-monorepo/types';
import PostActions from './PostActions';
import PostHeader from './PostHeader';
import { MediaWithSkeleton } from './MediaWithSkeleton';
import { useState } from 'react';
import Button from './Button';
import { MAX_POST_CONTENT_LENGTH } from '../lib/utils/constants';
import ProfileImage from './ProfileImage';
import PostSkeleton from './PostSkeleton';
import { useNavigate } from 'react-router-dom';

type PostProps = {
  post: PostType;
  reply?: PostType;
  isLoading?: boolean;
};

function Post({ post, reply, isLoading }: PostProps) {
  const [showFull, setShowFull] = useState(false);
  const navigate = useNavigate();

  const isLong = post.content.length > MAX_POST_CONTENT_LENGTH;
  const displayedContent = showFull
    ? post.content
    : post.content.slice(0, MAX_POST_CONTENT_LENGTH);

  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    <div
      onClick={() => navigate(`/posts/${post.id}`)}
      className="flex flex-col gap-4 p-8 rounded-2xl mt-2 shadow-sm bg-[var(--color-grey-50)]/20 border-r border-b border-[var(--color-grey-300)]/80 w-full cursor-pointer"
    >
      <div className="flex gap-4">
        <div>
          <ProfileImage size="sm" imgSrc={post.user.avatar} />
        </div>

        <div className="flex flex-col w-full gap-4">
          <PostHeader post={post} />
          <p className="break-all">
            {displayedContent}
            {!showFull && isLong && (
              <>
                {' '}
                <Button
                  variation="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFull(true);
                  }}
                  className="mt-1"
                >
                  Show more
                </Button>
              </>
            )}
            {showFull && isLong && (
              <Button
                variation="text"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFull(false);
                }}
                className="mt-1"
              >
                Show less
              </Button>
            )}
          </p>
          <div
            className={`grid gap-2 ${
              post?.medias?.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            {post?.medias?.length > 0 &&
              post.medias.map((media) => (
                <MediaWithSkeleton key={media.id} src={media.url} />
              ))}
          </div>

          <PostActions post={post} />
        </div>
      </div>
      {reply && (
        <div className="flex gap-4">
          <ProfileImage size="sm" imgSrc={reply.user.avatar} />

          <div className="flex flex-col w-full gap-4">
            <PostHeader post={reply} />
            <p className="break-all">
              {displayedContent}
              {!showFull && isLong && (
                <>
                  {' '}
                  <Button
                    variation="text"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFull(true);
                    }}
                    className="mt-1"
                  >
                    Show more
                  </Button>
                </>
              )}
              {showFull && isLong && (
                <Button
                  variation="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFull(false);
                  }}
                  className="mt-1"
                >
                  Show less
                </Button>
              )}
            </p>
            <div
              className={`grid gap-2 ${
                reply?.medias?.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
              }`}
            >
              {reply?.medias?.length > 0 &&
                reply.medias.map((media) => (
                  <MediaWithSkeleton key={media.id} src={media.url} />
                ))}
            </div>
            <PostActions post={reply} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
