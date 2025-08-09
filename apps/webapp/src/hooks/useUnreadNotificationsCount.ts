import { getUnreadNotificationsCount } from '../lib/api/notifications';
import { useQuery } from '@tanstack/react-query';

export const useUnreadNotificationsCount = () => {
  const {
    data: count,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications', 'unreadCount'],
    queryFn: getUnreadNotificationsCount,
  });

  return { count, isLoading, error };
};
