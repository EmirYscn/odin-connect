import { WsJwtGuard } from '../guards/ws-jwt.guard';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { AuthenticatedSocket } from '../../events/types/socket';

export type SocketIoMiddleware = {
  (socket: Socket, next: (err?: Error) => void): void;
};

export const SocketAuthMiddleware = (
  jwtService: JwtService,
  usersService: UsersService
): SocketIoMiddleware => {
  return (socket: Socket, next: (err?: Error) => void) => {
    WsJwtGuard.validateToken(
      socket as AuthenticatedSocket,
      jwtService,
      usersService
    )
      .then(() => next())
      .catch(next);
  };
};
