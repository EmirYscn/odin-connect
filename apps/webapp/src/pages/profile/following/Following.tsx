import { Link, useNavigate, useParams } from 'react-router-dom';
import { useUserFollowing } from '../../../hooks/useUserFollowing';
import ProfileImage from '../../../components/ProfileImage';
import BackButton from '../../../components/BackButton';
import PageHeader from '../../../components/PageHeader';

function Following() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { following, isLoading } = useUserFollowing(username || '');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl shadow-md border border-[var(--color-grey-100)]/60 px-6 py-4 animate-pulse"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--color-grey-200)]" />
            <div className="flex flex-col w-full gap-2">
              <div className="h-4 w-32 bg-[var(--color-grey-200)] rounded" />
              <div className="h-3 w-20 bg-[var(--color-grey-200)] rounded" />
              <div className="h-3 w-40 bg-[var(--color-grey-100)] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 ">
      <PageHeader text="Following" backTo={`/profile/${username}`} />

      {following && following.length > 0 ? (
        following.map((user) => (
          <Link
            to={`/profile/${user.username}`}
            key={user.id}
            className="flex items-center gap-3 rounded-xl shadow-md border border-[var(--color-grey-100)]/60 px-6 py-4 transition-transform hover:shadow-lg"
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${user?.profile?.id}`);
              }}
              className="transition-opacity duration-200 hover:opacity-80"
            >
              <ProfileImage size="sm" imgSrc={user.avatar} />
            </div>
            <div>
              <div className="font-semibold text-[var(--color-grey-700)] hover:underline">
                {user.displayName || user.username}
              </div>
              <div className="text-md text-[var(--color-grey-600)]/70">
                @{user.username}
              </div>
              {user.profile?.bio && (
                <div className="text-md text-[var(--color-grey-700)]">
                  {user.profile.bio}
                </div>
              )}
            </div>
          </Link>
        ))
      ) : (
        <span className="flex flex-col items-center justify-center py-12 text-[var(--color-grey-700)]">
          <svg
            width="48"
            height="48"
            fill="none"
            viewBox="0 0 24 24"
            className="mb-4 opacity-60"
          >
            <path
              stroke="currentColor"
              strokeWidth="1.5"
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6Z"
            />
          </svg>
          <span className="text-lg font-medium">{`@${username} isn’t following anyone yet.`}</span>
          <span className="mt-2 text-sm">
            When they do, you’ll see their connections here.
          </span>
        </span>
      )}
    </div>
  );
}

export default Following;
