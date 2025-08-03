import { BiCommentDetail, BiRepost } from 'react-icons/bi';
import Button from './Button';
import { FaHeart, FaRegBookmark, FaRegHeart } from 'react-icons/fa';
import { Post } from '@odin-connect-monorepo/types';
import { useLikePost } from '../hooks/useLikePost';

function PostActions({ post }: { post: Post }) {
  const { likes, replies, bookmarks, reposts } = post._count || {};
  const { likePost, isPending: isHandlingLike } = useLikePost();

  const isLiked = post.isLikedByCurrentUser;

  return (
    <div className="flex items-center gap-10">
      <div className="flex items-center">
        <Button
          icon={
            isLiked ? (
              <FaHeart className="text-lg" />
            ) : (
              <FaRegHeart className="text-lg" />
            )
          }
          size="small"
          className={`${
            isLiked && 'text-red-500'
          } hover:text-red-500/80 hover:bg-red-500/10 hover:animate-pulse !rounded-full !p-2`}
          onClick={(e) => {
            e.stopPropagation();
            likePost(post.id);
          }}
          disabled={isHandlingLike}
        />
        <span>{likes}</span>
      </div>
      <div className="flex items-center">
        <Button
          icon={<BiCommentDetail className="text-lg" />}
          size="small"
          className="hover:text-blue-500/80 hover:bg-blue-500/10 !rounded-full !p-2"
        />
        <span>{replies}</span>
      </div>
      <div className="flex items-center">
        <Button
          icon={<BiRepost className="text-lg" />}
          size="small"
          className="hover:text-green-500/80 hover:bg-green-500/10 !rounded-full !p-2"
        />
        <span>{reposts}</span>
      </div>
      <div className="flex items-center ml-auto">
        <Button
          icon={<FaRegBookmark className="text-lg" />}
          size="small"
          className="hover:text-blue-500/80 hover:bg-blue-500/10 !rounded-full !p-2"
        />
        <span>{bookmarks}</span>
      </div>
    </div>
  );
}

export default PostActions;
