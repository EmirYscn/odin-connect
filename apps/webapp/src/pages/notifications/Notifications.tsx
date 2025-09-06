import { useEffect } from 'react';
import Button from '../../components/Button';
import SpinnerMini from '../../components/SpinnerMini';
import { useNotifications } from '../../hooks/useNotifications';

import Notification from './components/Notification';
import NotificationSkeleton from './components/NotificationSkeleton';
import PageHeader from '../../components/PageHeader';

function Notifications() {
  const {
    notifications,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    markAllAsRead,
    isLoading,
  } = useNotifications();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (markAllAsRead) {
        markAllAsRead();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-8 p-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <NotificationSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-8 p-2 sm:p-4">
      <PageHeader text="Notifications" />
      {notifications &&
        notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      {hasNextPage && (
        <Button
          variation="loadMore"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <span className="flex items-center gap-2">
              <SpinnerMini />
              Loading...
            </span>
          ) : (
            'Load More'
          )}
        </Button>
      )}
    </div>
  );
}

export default Notifications;
