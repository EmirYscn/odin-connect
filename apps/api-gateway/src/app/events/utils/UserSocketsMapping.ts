import { User } from '@prisma/client';
import { AuthenticatedSocket } from '../types/socket';

export const userSocketMap = new Map<string, Set<string>>();

export const handleUserSocketMappingOnConnnect = (
  socket: AuthenticatedSocket,
  user: User
) => {
  // handle user socket mapping
  if (!userSocketMap.has(user.id)) {
    userSocketMap.set(user.id, new Set());
  }
  userSocketMap.get(user.id)?.add(socket.id);
  console.log('Connected User: ', user);
  console.log('Current socket map:', Array.from(userSocketMap.entries()));
  console.log(
    `User with DBID: ${user.id} connected with socket ID ${socket.id}`
  );
};

export const handleUserSocketMappingOnDisconnect = (
  socket: AuthenticatedSocket,
  user: User
) => {
  const userId = user.id;
  const sockets = userSocketMap.get(userId);
  if (sockets) {
    sockets.delete(socket.id);
    if (sockets.size === 0) {
      userSocketMap.delete(userId);
    }
  }
  console.log('Disconnected User: ', user);
  console.log('Current socket map:', Array.from(userSocketMap.entries()));
  console.log(
    `User with DBID: ${userId} disconnected from socket ID ${socket.id}`
  );
};
