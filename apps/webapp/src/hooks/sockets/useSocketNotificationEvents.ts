import { Notification } from '@odin-connect-monorepo/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { NOTIFICATIONS } from '../../lib/utils/queryKeys';

export function useSocketNotificationEvents() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNotificationReceived = (data: Partial<Notification>) => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATIONS,
        exact: false,
      });
    };

    socket.on('notification:received', handleNotificationReceived);

    return () => {
      socket.off('notification:received', handleNotificationReceived);
    };
  }, [socket, queryClient]);
}
