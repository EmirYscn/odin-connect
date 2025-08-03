import { IoLocationOutline } from 'react-icons/io5';
import { RiLink } from 'react-icons/ri';
import { LuCalendarDays } from 'react-icons/lu';

import ProfileHeaderSkeleton from './ProfileHeaderSkeleton';
import EditProfile from './EditProfile';

import ProfileBackgroundImage from './ProfileBackgroundImage';
import { useUser } from '../../../hooks/useUser';
import { Profile } from '@odin-connect-monorepo/types';
import ProfileImage from '../../../components/ProfileImage';
import { formatJoinedDate } from '../../../lib/utils/formatDate';

type ProfileHeaderProps = {
  profile: Profile | undefined;
  isLoading?: boolean;
};

function ProfileHeader({ profile, isLoading }: ProfileHeaderProps) {
  const { user } = useUser();
  const isCurrentUser = user?.id === profile?.user.id;
  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  return (
    <>
      <div className="relative">
        <ProfileBackgroundImage imgSrc={profile?.user.backgroundImage} />
        <div className="absolute left-4 -bottom-12">
          <ProfileImage imgSrc={profile?.user.avatar} />
        </div>
      </div>
      {isCurrentUser ? <EditProfile /> : <div className="h-12" />}

      <div className="p-2 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-xl">
            {profile?.user.displayName}
          </span>
          <span className="">@{profile?.user.username}</span>
        </div>

        <div>
          <span className="">{profile?.bio}</span>
        </div>
        <div className="flex gap-4">
          {profile?.location && (
            <div className="flex items-center gap-1 text-sm text-[var(--color-grey-500)]">
              <IoLocationOutline className="text-sm" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile?.website && (
            <div className="flex items-center gap-1 text-sm text-[var(--color-grey-500)]">
              <RiLink className="text-lg" />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-sm hover:text-[var(--color-blue-200)] hover:underline">
                  {profile.website}
                </span>
              </a>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-[var(--color-grey-500)]">
            <LuCalendarDays />
            <span>Joined {formatJoinedDate(profile?.createdAt as string)}</span>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-bold">{profile?.user._count?.posts}</span>
            <span className="text-[var(--color-grey-500)]">Posts</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{profile?.user._count?.following}</span>
            <span className="text-[var(--color-grey-500)]">Following</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{profile?.user._count?.followers}</span>
            <span className="text-[var(--color-grey-500)]">Followers</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileHeader;
