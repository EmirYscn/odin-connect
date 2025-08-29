import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

import { PrismaModule } from '@odin-connect-monorepo/prisma';
import { UsersModule } from '../users/users.module';
import { MediaModule } from '../media/media.module';
import { EventsModule } from '../events/events.module';
import { NotificationClientModule } from '../notification-client/notification-client.module';

@Module({
  imports: [
    PrismaModule,
    EventsModule,
    forwardRef(() => UsersModule),
    MediaModule,
    forwardRef(() => NotificationClientModule),
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
