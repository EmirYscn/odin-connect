import { Notification as NotificationType } from '@odin-connect-monorepo/types';
import ProfileImage from '../../components/ProfileImage';
import { useNotifications } from '../../hooks/useNotifications';
import { formatTimeAgo } from '../../lib/utils/formatDate';
import { HiOutlineBell, HiOutlineHeart } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

function Notifications() {
  const { notifications, isLoading } = useNotifications();

  return (
    <div className="flex flex-col w-full gap-8 p-10">
      {notifications &&
        notifications.map((notification) => (
          <Notification notification={notification} />
        ))}
    </div>
  );
}

export default Notifications;

function Notification({ notification }: { notification: NotificationType }) {
  const navigate = useNavigate();
  let Icon = HiOutlineBell;
  // if (notification.type === 'LIKE') Icon = HiOutlineHeart;
  // else if (notification.type === 'REPOST') Icon = HiOutlineRefresh;
  // else if (notification.type === 'REPLY') Icon = HiOutlineChat;

  const actor = notification.message.split(' ')[0];
  const message = notification.message.replace(actor, '').trim();

  // return (
  //   <div key={notification.id} className="flex gap-4">
  //     <ProfileImage imgSrc={notification.actor.avatar} size="sm" />

  //     <div className="flex items-center justify-between w-full gap-2">
  //       <div className="flex gap-2">
  //         <span className="font-semibold text-[var(--color-grey-700)]">
  //           {actor}
  //         </span>
  //         <p className="text-[var(--color-grey-700)]/60">{message}</p>
  //       </div>
  //       <span className=" text-[var(--color-grey-700)]/60">
  //         {formatTimeAgo(notification.createdAt as string)}
  //       </span>
  //     </div>
  //   </div>
  // );

  return (
    <div
      key={notification.id}
      className="flex gap-4 items-center rounded-xl shadow-md border border-[var(--color-grey-100)]/60 px-6 py-4 transition-transform hover:scale-[1.02] hover:shadow-lg cursor-default"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/posts/${notification.postId}`);
      }}
    >
      <span className="rounded-full bg-[var(--color-primary-100)] p-2">
        <Icon className="w-6 h-6 text-[var(--color-grey-700)]" />
      </span>
      <div
        className="hover:opacity-80"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${notification.actor.profile?.id}`);
        }}
      >
        <ProfileImage imgSrc={notification.actor.avatar} size="sm" />
      </div>

      <div className="flex flex-col justify-center w-full">
        <div className="flex items-center gap-2">
          <span
            className="font-semibold text-[var(--color-grey-800)] hover:font-bold hover:underline cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${notification.actor.profile?.id}`);
            }}
          >
            {actor}
          </span>
          <p className="text-[var(--color-grey-700)]/80">{message}</p>
        </div>
        <span className="text-xs text-[var(--color-grey-600)]/60 mt-1">
          {formatTimeAgo(notification.createdAt as string)}
        </span>
      </div>
    </div>
  );
}
