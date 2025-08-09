import { useParams } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useProfilePosts } from '../../hooks/useProfilePosts';
import ProfileTabs, { ProfileTabContext } from './components/ProfileTabs';
import { useState } from 'react';
import BackButton from '../../components/BackButton';
import ProfileHeader from './components/ProfileHeader';
import Posts from '../../components/Posts';
import Replies from './components/Replies';
import Medias from './components/Medias';

function Profile() {
  const { id } = useParams();
  const { profile, isLoading: isLoadingProfile } = useProfile(id as string);

  const { userPosts, isLoading: isLoadingPosts } = useProfilePosts(
    id as string
  );
  const [context, setContext] = useState<ProfileTabContext>('posts');

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2 py-4 sticky top-0 z-10 backdrop-blur-md bg-[var(--color-grey-50)]/10 rounded-bl-md rounded-br-md">
        <BackButton />
        <span className="text-xl font-semibold text-[var(--color-grey-700)]/90">
          {profile?.user.displayName}
        </span>
      </div>

      <ProfileHeader profile={profile} isLoading={isLoadingProfile} />

      <ProfileTabs context={context} setContext={setContext} />

      {context === 'posts' && (
        <Posts posts={userPosts} isLoading={isLoadingPosts} context="profile" />
      )}

      {context === 'replies' && <Replies profileId={id as string} />}

      {context === 'media' && <Medias profileId={id as string} />}
    </div>
  );
}

export default Profile;
