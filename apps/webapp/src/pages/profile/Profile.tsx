import { useParams } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useProfilePosts } from '../../hooks/useProfilePosts';
import ProfileTabs, { ProfileTabContext } from './components/ProfileTabs';
import { useState } from 'react';

import ProfileHeader from './components/ProfileHeader';
import Posts from '../../components/Posts';
import Replies from './components/Replies';
import Medias from './components/Medias';
import PageHeader from '../../components/PageHeader';

function Profile() {
  const { username } = useParams();
  const { profile, isLoading: isLoadingProfile } = useProfile(
    username as string
  );

  const { userPosts, isLoading: isLoadingPosts } = useProfilePosts(
    username as string
  );
  const [context, setContext] = useState<ProfileTabContext>('posts');

  return (
    <div key={profile?.id} className="flex flex-col gap-4 p-4">
      <PageHeader text={profile?.user.displayName} />

      <ProfileHeader profile={profile} isLoading={isLoadingProfile} />

      <ProfileTabs context={context} setContext={setContext} />

      {context === 'posts' && (
        <Posts posts={userPosts} isLoading={isLoadingPosts} context="profile" />
      )}

      {context === 'replies' && <Replies username={username as string} />}

      {context === 'media' && <Medias username={username as string} />}
    </div>
  );
}

export default Profile;
