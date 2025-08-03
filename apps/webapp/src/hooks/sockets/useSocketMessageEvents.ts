import { useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';

export function useSocketMessageEvents() {
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log('Socket connected:', socket.id);
    };
    const handleMessage = (data: string) => {
      console.log('New message received:', data);
    };

    socket.on('connect', handleConnect);
    socket.on('message:received', handleMessage);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('message:received', handleMessage);
    };
  }, [socket]);
}
