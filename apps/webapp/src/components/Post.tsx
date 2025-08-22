import { useNavigate } from 'react-router-dom';
import { Post as PostType } from '@odin-connect-monorepo/types';

import PostActions from './PostActions';
import PostHeader from './PostHeader';
import ProfileImage from './ProfileImage';
import PostSkeleton from './PostSkeleton';
import PostContent from './PostContent';
import PostMedias from './PostMedias';
import { BiRepost } from 'react-icons/bi';

type PostProps = {
  post: PostType;
  isLoading?: boolean;
  isParentPost?: boolean; // to indicate if this is a parent post
  isRepostOf?: boolean; // to indicate if this is a repostof
};

function Post({ post, isLoading, isParentPost, isRepostOf }: PostProps) {
  const navigate = useNavigate();

  const hasRepostOf = post.repostOfId && post.repostOf;
  const hasContent = post.content || post.medias?.length > 0;

  const isRepostWithNoContent = hasRepostOf && !hasContent;

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (isRepostWithNoContent) {
    const repostOf = post.repostOf as PostType;

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/post/${repostOf.id}`);
        }}
        className="flex flex-col gap-4 p-8 rounded-2xl mt-2 shadow-sm bg-[var(--color-grey-50)]/20 border-r border-b border-[var(--color-grey-300)]/80 w-full cursor-pointer"
      >
        <div className="flex items-center gap-1 text-sm text-[var(--color-grey-700)]/80">
          <BiRepost />
          <span
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${post?.user?.profile?.id}`);
            }}
            className="cursor-pointer hover:underline"
          >
            {post.user.displayName} has reposted
          </span>
        </div>
        <div className="flex gap-4">
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${repostOf?.user?.profile?.id}`);
            }}
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <ProfileImage size="sm" imgSrc={repostOf.user.avatar} />
          </div>

          <div className="flex flex-col w-full gap-4">
            <PostHeader post={repostOf} />
            <PostContent content={repostOf.content} />
            <PostMedias medias={repostOf.medias} />

            {/* if this post is a repost of another post */}
            {repostOf.repostOf?.id && repostOf.repostOf && (
              <Post post={repostOf.repostOf} isRepostOf />
            )}

            {!isRepostOf && <PostActions post={repostOf} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/post/${post.id}`);
      }}
      className="flex gap-4 p-8 rounded-2xl mt-2 shadow-sm bg-[var(--color-grey-50)]/20 border-r border-b border-[var(--color-grey-300)]/80 w-full cursor-pointer"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${post?.user?.profile?.id}`);
        }}
        className="transition-opacity duration-200 hover:opacity-80"
      >
        <ProfileImage size="sm" imgSrc={post.user.avatar} />
      </div>

      <div className="flex flex-col w-full gap-4">
        <PostHeader post={post} />
        <PostContent content={post.content} />
        <PostMedias medias={post.medias} />

        {/* if this post is a repost of another post */}
        {post.repostOfId && post.repostOf && (
          <Post post={post.repostOf} isRepostOf />
        )}

        {/* if this post is a reply to another post */}
        {post.parentId && post.parent && (
          <Post post={post.parent} isParentPost />
        )}

        {!isRepostOf && <PostActions post={post} />}
      </div>
    </div>
  );
}

export default Post;
