import { useNavigate } from 'react-router-dom';
import ProfileImage from '../../../components/ProfileImage';
import {
  formatDateWithoutTime,
  formatTimeAgo,
} from '../../../lib/utils/formatDate';
import { Notification as NotificationType } from '@odin-connect-monorepo/types';

import { HiOutlineBell, HiOutlineHeart } from 'react-icons/hi2';
import { BiCommentDetail, BiRepost } from 'react-icons/bi';
import { DateMessage } from '../../../hooks/useNotifications';
import { LuUserRound } from 'react-icons/lu';

function Notification({
  notification,
}: {
  notification: NotificationType | DateMessage;
}) {
  const navigate = useNavigate();

  let Icon = HiOutlineBell;
  if (notification.type === 'LIKE') Icon = HiOutlineHeart;
  else if (notification.type === 'REPOST') Icon = BiRepost;
  else if (notification.type === 'REPLY') Icon = BiCommentDetail;
  else if (notification.type === 'FOLLOW') Icon = LuUserRound;

  // Extract the actor and message from the notification
  const actor =
    notification.type !== 'SYSTEM' && notification.message.split(' ')[0];
  const message =
    notification.type !== 'SYSTEM' &&
    actor &&
    notification.message.replace(actor, '').trim();

  const notificationNavigate = () => {
    const nt = notification as NotificationType;
    if (nt.postId) {
      navigate(`/post/${nt.postId}`);
    } else if (nt.type === 'FOLLOW') {
      navigate(`/profile/${nt.actor.username}`);
    }
  };

  // Format the date for today and yesterday
  const today = formatDateWithoutTime(new Date().toISOString());
  const yesterday = formatDateWithoutTime(
    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  );

  // If the notification is a date message, return a simple text element
  if (notification.type === 'SYSTEM') {
    return (
      <div className="flex items-center justify-center text-sm text-[var(--color-grey-600)]/70 p-4">
        {notification.message === today
          ? 'Today'
          : notification.message === yesterday
          ? 'Yesterday'
          : notification.message}
      </div>
    );
  }

  return (
    <div
      className={`flex gap-4 items-center rounded-xl shadow-md border border-[var(--color-grey-100)]/60 px-6 py-4 transition-transform hover:scale-[1.02] hover:shadow-lg cursor-default relative`}
      onClick={(e) => {
        e.stopPropagation();
        notificationNavigate();
      }}
    >
      {!notification.read && (
        <span className="absolute w-2 h-2 transition-all duration-1000 bg-blue-500 rounded-full top-2 left-2"></span>
      )}
      <span className="rounded-full bg-[var(--color-primary-100)] p-2">
        <Icon className="w-6 h-6 text-[var(--color-grey-700)]" />
      </span>
      <div
        className="hover:opacity-80"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${notification.actor.username}`);
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
              navigate(`/profile/${notification.actor.username}`);
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
export default Notification;
