import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import envValidation from './config/env.validation';
import { PrismaModule } from '@odin-connect-monorepo/prisma';
import { UsersModule } from './users/users.module';
import { SupabaseModule } from './supabase/supabase.module';
// import { RepostsModule } from './reposts/reposts.module';
import { ProfileModule } from './profile/profile.module';
import { PostsModule } from './posts/posts.module';
import { MediaModule } from './media/media.module';
import { LikesModule } from './likes/likes.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { EventsModule } from './events/events.module';
import { NotificationClientModule } from './notification-client/notification-client.module';
import { NotificationsModule } from './notifications/notifications.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    UsersModule,
    // RepostsModule,
    ProfileModule,
    PostsModule,
    MediaModule,
    LikesModule,
    BookmarksModule,
    EventsModule,
    NotificationClientModule,
    NotificationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV.trim()}`,
      load: [appConfig],
      validationSchema: envValidation,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
