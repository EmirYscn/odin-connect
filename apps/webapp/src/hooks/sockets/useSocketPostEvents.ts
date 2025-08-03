import { Post, PostCreatedPayload } from '@odin-connect-monorepo/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';

export function useSocketPostEvents() {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handlePostCreated = (data: PostCreatedPayload) => {
      console.log('Post created event received:', data);
      queryClient.invalidateQueries({
        queryKey: ['posts'],
        exact: false,
      });
    };

    socket.on('post:created', handlePostCreated);

    return () => {
      socket.off('post:created', handlePostCreated);
    };
  }, [socket, queryClient]);
}
