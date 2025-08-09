import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PrismaModule } from '@odin-connect-monorepo/prisma';
import { NotificationClientModule } from '../notification-client/notification-client.module';

@Module({
  imports: [PrismaModule, NotificationClientModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
