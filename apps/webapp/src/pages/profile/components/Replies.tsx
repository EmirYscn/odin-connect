import Posts from '../../../components/Posts';
import { useProfileReplies } from '../../../hooks/useProfileReplies';

type RepliesProps = {
  profileId: string;
};

function Replies({ profileId }: RepliesProps) {
  const { replies, isLoading: isLoadingReplies } = useProfileReplies(
    profileId as string
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
