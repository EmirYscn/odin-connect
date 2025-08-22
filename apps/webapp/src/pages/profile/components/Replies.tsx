import Posts from '../../../components/Posts';
import { useProfileReplies } from '../../../hooks/useProfileReplies';

type RepliesProps = {
  username: string;
};

function Replies({ username }: RepliesProps) {
  const { replies, isLoading: isLoadingReplies } = useProfileReplies(
    username as string
  );

  return (
    <Posts
      posts={replies}
      isLoading={isLoadingReplies}
      context="profile_replies"
    />
  );
}

export default Replies;
