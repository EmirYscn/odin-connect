import { io, Socket } from 'socket.io-client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@odin-connect-monorepo/types';
import { env } from '../env';

const SOCKET_URL = env.socketUrl;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  SOCKET_URL,
  {
    autoConnect: false,
    transports: ['websocket'],
  }
);

export const connectSocket = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    socket.auth = { token };
  }
  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
