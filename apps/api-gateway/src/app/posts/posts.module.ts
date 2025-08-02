import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

import { PrismaModule } from '@odin-connect-monorepo/prisma';
import { UsersModule } from '../users/users.module';
import { ProfileModule } from '../profile/profile.module';
import { MediaModule } from '../media/media.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    PrismaModule,
    EventsModule,
    UsersModule,
    ProfileModule,
    MediaModule,
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
