import { BiCommentDetail, BiRepost } from 'react-icons/bi';
import Button from './Button';
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from 'react-icons/fa';
import { Post } from '@odin-connect-monorepo/types';
import { useLikePost } from '../hooks/useLikePost';
import { useRepostPost } from '../hooks/useRepostPost';
import { useBookmarkPost } from '../hooks/useBookmarkPost';
import { useNavigate } from 'react-router-dom';

function PostActions({ post }: { post: Post }) {
  const navigate = useNavigate();
  const { likes, replies, bookmarks, reposts } = post._count || {};
  const { likePost, isPending: isHandlingLike } = useLikePost();
  const { repostPost, isPending: isHandlingRepost } = useRepostPost();
  const { bookmarkPost, isPending: isHandlingBookmark } = useBookmarkPost();

  const isLiked = post.isLikedByCurrentUser;
  const isReposted = post.isRepostedByCurrentUser;
  const isBookmarked = post.isBookmarkedByCurrentUser;

  return (
    <div className="flex items-center gap-10 text-[var(--color-grey-600)]/80">
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
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/post/${post.id}`);
          }}
        />
        <span>{replies}</span>
      </div>
      <div className="flex items-center">
        <Button
          icon={<BiRepost className="text-lg" />}
          size="small"
          className={`${
            isReposted && 'text-green-500'
          } hover:text-green-500/80 hover:bg-green-500/10 !rounded-full !p-2`}
          onClick={(e) => {
            e.stopPropagation();
            repostPost(post.id);
          }}
          disabled={isHandlingRepost}
        />
        <span>{reposts}</span>
      </div>
      <div className="flex items-center ml-auto">
        <Button
          icon={
            isBookmarked ? (
              <FaBookmark className="text-lg" />
            ) : (
              <FaRegBookmark className="text-lg" />
            )
          }
          size="small"
          className={`${
            isBookmarked && 'text-blue-500'
          } hover:text-blue-500/80 hover:bg-blue-500/10 !rounded-full !p-2`}
          onClick={(e) => {
            e.stopPropagation();
            bookmarkPost(post.id);
          }}
          disabled={isHandlingBookmark}
        />
        <span>{bookmarks}</span>
      </div>
    </div>
  );
}

export default PostActions;
