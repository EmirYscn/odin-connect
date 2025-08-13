import { getUnreadNotificationsCount } from '../lib/api/notifications';
import { useQuery } from '@tanstack/react-query';
import { NOTIFICATIONS_UNREAD_COUNT } from '../lib/utils/queryKeys';

export const useUnreadNotificationsCount = () => {
  const {
    data: count,
    isLoading,
    error,
  } = useQuery({
    queryKey: NOTIFICATIONS_UNREAD_COUNT,
    queryFn: getUnreadNotificationsCount,
  });

  return { count, isLoading, error };
};
