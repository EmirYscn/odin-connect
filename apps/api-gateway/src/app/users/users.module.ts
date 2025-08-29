import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@odin-connect-monorepo/prisma';
import { AuthModule } from '../auth/auth.module';
import { NotificationClientModule } from '../notification-client/notification-client.module';

@Module({
  imports: [
    PrismaModule,
    NotificationClientModule,
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
