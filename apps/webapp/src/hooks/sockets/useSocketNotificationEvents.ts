import { Notification } from '@odin-connect-monorepo/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import toast from 'react-hot-toast';

export function useSocketNotificationEvents() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNotificationReceived = (data: Partial<Notification>) => {
      console.log('Notification created event received: ', data);
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
        exact: false,
      });
      toast.success(
        `New notification: ${data.message || 'You have a new notification!'}`
      );
    };

    socket.on('notification:received', handleNotificationReceived);

    return () => {
      socket.off('notification:received', handleNotificationReceived);
    };
  }, [socket, queryClient]);
}
