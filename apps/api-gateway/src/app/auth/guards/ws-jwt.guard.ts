import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { UsersService } from '../../users/users.service';
import { AuthenticatedSocket } from '../../events/types/socket';
import { JwtObject } from '../../common/types/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client = context.switchToWs().getClient<AuthenticatedSocket>();

    await WsJwtGuard.validateToken(client, this.jwtService, this.usersService);

    return true;
  }

  static async validateToken(
    socket: AuthenticatedSocket,
    jwtService: JwtService,
    usersService: UsersService
  ) {
    const accessToken = socket.handshake.auth.accessToken as string;
    if (!accessToken) {
      throw new WsException('Invalid credentials.');
    }
    try {
      const payload = await jwtService.verifyAsync<JwtObject>(accessToken);
      const user = await usersService.getUserById(payload.sub);

      if (!user) {
        throw new WsException('User not found.');
      }

      socket.user = {
        id: user.id,
        email: user.email,
        username: user.username,
      } as User;
    } catch {
      throw new WsException('Invalid credentials.');
    }
  }
}
