import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@odin-connect-monorepo/types';
import { env } from '../lib/env';

import { createContext, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext<Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null>(null);

export let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
  null;
if (typeof window !== 'undefined' && !socket) {
  socket = io(env.socketUrl, {
    autoConnect: false,
  });
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketRef = useRef<Socket | null>(socket);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

export const connectSocket = () => {
  const token = localStorage.getItem('accessToken');
  if (!socket) {
    console.error('Socket is not initialized');
    return;
  }
  if (token) {
    socket.auth = { accessToken: token };
  }
  socket?.connect();
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
