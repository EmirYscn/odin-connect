import { Post as PostType } from '@odin-connect-monorepo/types';
import PostDate from './PostDate';

import Menus from './Menus';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useDeletePost } from '../hooks/useDeletePost';
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom';

function PostHeader({ post }: { post: PostType }) {
  const navigate = useNavigate();

  const { user } = useUser();
  const { deletePost, isPending: isDeletingPost } = useDeletePost();

  const isCurrentUserPost = user?.id === post.user.id;

  return (
    <div className="flex items-center gap-2 text-[var(--color-grey-600)]/70">
      <div className="flex items-center gap-1">
        <span
          className="text-[var(--color-grey-600)] font-semibold cursor-pointer hover:underline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${post?.user?.username}`);
          }}
        >
          {post.user.username}
        </span>
        <span className="text-sm">@{post.user.displayName}</span>
      </div>
      <span className="font-semibold">·</span>
      <div className="text-sm">
        <PostDate date={post.createdAt as string} />
      </div>
      {isCurrentUserPost && (
        <div className="ml-auto">
          <Menus>
            <Menus.Menu>
              <Menus.Toggle id={post.id} />
              <Menus.List id={post.id}>
                <Menus.Button
                  icon={<FaRegTrashAlt />}
                  onClick={() => {
                    deletePost(post.id);
                  }}
                  disabled={isDeletingPost}
                >
                  <span>Delete</span>
                </Menus.Button>
              </Menus.List>
            </Menus.Menu>
          </Menus>
        </div>
      )}
    </div>
  );
}

export default PostHeader;
