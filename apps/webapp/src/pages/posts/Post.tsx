import { useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import Post from '../../components/Post';
import PostInput from '../../components/PostInput';
import Posts from '../../components/Posts';
import PostSkeleton from '../../components/PostSkeleton';
import { usePost } from '../../hooks/usePost';
import { useReplies } from '../../hooks/useReplies';
import NotFound from './NotFound';

function PostPage() {
  const { id } = useParams();
  const { post, isLoading: isPostLoading, error } = usePost(id as string);
  const { replies, isLoading: isRepliesLoading } = useReplies(id as string);

  if (error) return <NotFound />;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2 py-4">
        <BackButton navigateTo="/home" />
        <span className="text-xl font-semibold">Post</span>
      </div>
      {post && !isPostLoading ? <Post post={post} /> : <PostSkeleton />}
      <div className="flex flex-col">
        <PostInput placeholder="Post your reply" parentPostId={id as string} />
        {post && !isRepliesLoading && replies && replies.length > 0 && (
          <Posts posts={replies} />
        )}
      </div>
    </div>
  );
}

export default PostPage;
