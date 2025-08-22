import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { POST_QUERY_KEY } from '../../lib/utils/queryKeys';
import { FullPost } from '@odin-connect-monorepo/types';

export function useSocketPostEvents() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handlePostCreated = (data: FullPost) => {
      queryClient.invalidateQueries({
        queryKey: [POST_QUERY_KEY],
        exact: false,
      });
    };

    socket.on('post:created', handlePostCreated);

    return () => {
      socket.off('post:created', handlePostCreated);
    };
  }, [socket, queryClient]);
}
