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
import Button from '../../../components/Button';
import { useFollow } from '../../../hooks/useFollow';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type ProfileHeaderProps = {
  profile: Profile | undefined;
  isLoading?: boolean;
};

function ProfileHeader({ profile, isLoading }: ProfileHeaderProps) {
  const [isFollowButtonHovered, setIsFollowButtonHovered] = useState(false);
  const { user } = useUser();
  const { followUser, isPending: isHandlingFollow } = useFollow();
  const isCurrentUser = user?.id === profile?.user.id;

  const isFollowing = profile?.isFollowedByCurrentUser;
  const isFollower = profile?.isCurrentUserFollowedByThisUser;

  if (isLoading) {
    return <ProfileHeaderSkeleton />;
  }

  return (
    <>
      <div className="relative">
        <ProfileBackgroundImage
          key={profile?.userId}
          imgSrc={profile?.user.backgroundImage}
        />
        <div className="absolute left-4 -bottom-12">
          <ProfileImage
            key={profile?.userId}
            imgSrc={profile?.user.avatar}
            context="profile"
          />
        </div>
      </div>
      {isCurrentUser ? (
        <EditProfile />
      ) : (
        <div className="px-2 ml-auto">
          <Button
            variation="follow"
            onClick={() => followUser(profile?.user?.username as string)}
            className={`${isFollowing && 'hover:bg-red-500/80'}`}
            disabled={isHandlingFollow}
            onMouseEnter={() => setIsFollowButtonHovered(true)}
            onMouseLeave={() => setIsFollowButtonHovered(false)}
          >
            {isFollowing
              ? isFollowButtonHovered
                ? 'Unfollow'
                : 'Following'
              : isFollower
              ? 'Follow Back'
              : 'Follow'}
          </Button>
        </div>
      )}

      <div className="p-2 flex flex-col gap-4 text-[var(--color-grey-700)]/80">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-semibold">
            {profile?.user.displayName}
          </span>
          <div className="flex items-center gap-2">
            <span className="">@{profile?.user.username}</span>
            {isFollower && (
              <span className="px-1 py-0.5 text-[var(--color-grey-700)]/80 bg-[var(--color-blue-100)] rounded-md text-xs font-medium">
                Follows you
              </span>
            )}
          </div>
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
            <Link
              to={`/profile/${profile?.user.username}/following`}
              className="text-[var(--color-grey-500)] hover:underline"
            >
              Following
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{profile?.user._count?.followers}</span>
            <Link
              to={`/profile/${profile?.user.username}/followers`}
              className="text-[var(--color-grey-500)] hover:underline"
            >
              Followers
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileHeader;
