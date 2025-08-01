// import { AuthenticatedSocket } from 'src/events/types/socket';
// import { WsJwtGuard } from '../guards/ws-jwt.guard';
// import { Socket } from 'socket.io';
// import { JwtService } from '@nestjs/jwt';
// import { UsersService } from 'src/users/users.service';

// export type SocketIoMiddleware = {
//   (socket: Socket, next: (err?: Error) => void): void;
// };

// export const SocketAuthMiddleware = (
//   jwtService: JwtService,
//   usersService: UsersService,
// ): SocketIoMiddleware => {
//   return (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
//     WsJwtGuard.validateToken(socket, jwtService, usersService)
//       .then(() => next())
//       .catch(next);
//   };
// };
