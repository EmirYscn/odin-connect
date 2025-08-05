import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PrismaModule } from '@odin-connect-monorepo/prisma';
import { NotificationClientModule } from '../notification-client/notification-client.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationClientModule, NotificationsModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
