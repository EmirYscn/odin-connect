import Post from '../../../components/Post';
import { useProfileReplies } from '../../../hooks/useProfileReplies';

type RepliesProps = {
  profileId: string;
};

function Replies({ profileId }: RepliesProps) {
  const { replies, isLoading: isLoadingReplies } = useProfileReplies(
    profileId as string
  );

  return (
    replies &&
    replies.length > 0 &&
    replies.map((reply) => (
      <Post
        key={`${reply.id}-${reply?.parent?.id}`}
        post={reply.parent!}
        reply={reply}
      />
    ))
  );
}

export default Replies;
