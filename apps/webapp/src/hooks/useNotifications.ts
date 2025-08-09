import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../lib/api/notifications';

export const useNotifications = () => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  return { notifications, isLoading };
};
