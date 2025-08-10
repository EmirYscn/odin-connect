import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getNotifications,
  markAllNotificationsAsRead,
} from '../lib/api/notifications';
import { formatDateWithoutTime } from '../lib/utils/formatDate';
import { Notification } from '@odin-connect-monorepo/types';

export type DateMessage = {
  id: string;
  type: 'SYSTEM';
  message?: string;
};

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const {
    data: notifications,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getNotifications(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
        exact: false,
      });
    },
  });

  const formattedNotifications = notifications?.pages.flatMap(
    (page) => page.notifications
  );

  const notificationsWithDateMarkers: (DateMessage | Notification)[] = [];
  let lastDate = '';

  formattedNotifications?.forEach((notification) => {
    const notificationDate = formatDateWithoutTime(
      notification.createdAt.toString()
    );
    if (notificationDate !== lastDate) {
      // Insert a date marker message before the first message of a new date
      notificationsWithDateMarkers.push({
        id: `date-${notificationDate}`, // unique id for date marker
        type: 'SYSTEM',
        message: notificationDate,
      });
      lastDate = notificationDate;
    }
    notificationsWithDateMarkers.push(notification);
  });

  return {
    notifications: notificationsWithDateMarkers,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    markAllAsRead,
    isMarkingAllAsRead,
  };
};
