import { Logger, OnModuleInit, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ConfigService } from '@nestjs/config';
import type { AuthenticatedSocket } from './types/socket';
import {
  handleUserSocketMappingOnConnnect,
  handleUserSocketMappingOnDisconnect,
  userSocketMap,
} from './utils/UserSocketsMapping';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { WsJwtGuard } from '../auth/guards/ws-jwt.guard';
import { SocketAuthMiddleware } from '../auth/middlewares/ws.middleware';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@odin-connect-monorepo/types';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class EventsGateway implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}
  @WebSocketServer()
  private server!: Server<ClientToServerEvents, ServerToClientEvents>;

  afterInit(server: Server) {
    server.use(SocketAuthMiddleware(this.jwtService, this.usersService));
    Logger.log('WebSocket server initialized');
  }

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      // handle user socket mapping
      const authSocket = socket as AuthenticatedSocket;
      handleUserSocketMappingOnConnnect(authSocket, authSocket.user);

      socket.on('disconnect', () => {
        handleUserSocketMappingOnDisconnect(authSocket, authSocket.user);
      });
    });
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() payload: string) {
    console.log(payload);
    this.server.emit('message:received', `Message: ${payload} received`);
  }

  sendMessage(message: string) {
    this.server.emit('message:received', message);
  }

  broadcastToAll<E extends keyof ServerToClientEvents>(
    event: E,
    ...args: Parameters<ServerToClientEvents[E]>
  ) {
    this.server.emit(event, ...args);
  }

  broadcastToRoom<E extends keyof ServerToClientEvents>(
    room: string,
    event: E,
    ...args: Parameters<ServerToClientEvents[E]>
  ) {
    this.server.to(room).emit(event, ...args);
  }

  broadcastToUser<E extends keyof ServerToClientEvents>(
    userId: string,
    event: E,
    ...args: Parameters<ServerToClientEvents[E]>
  ) {
    const socketIds = userSocketMap.get(userId);
    if (!socketIds) return;
    for (const socketId of socketIds) {
      this.server.to(socketId).emit(event, ...args);
    }
  }
}
