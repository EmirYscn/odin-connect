import { Socket } from 'socket.io';
import { User } from '@prisma/client';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@odin-connect-monorepo/types';

export interface AuthenticatedSocket
  extends Socket<ClientToServerEvents, ServerToClientEvents> {
  user: User;
}
