import { forwardRef, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  NOTIFICATION_SERVICE_RABBITMQ,
  NOTIFICATION_SERVICE_NOTIFICATION_QUEUE,
} from '@odin-connect-monorepo/types';
import { NotificationEventsController } from './notification-events.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { EventsModule } from '../events/events.module';
import { NotificationClientService } from './notification-client.service';
import { PostsModule } from '../posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => PostsModule),
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SERVICE_RABBITMQ,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')!],
            queue: NOTIFICATION_SERVICE_NOTIFICATION_QUEUE,
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    EventsModule,
    NotificationsModule,
  ],
  controllers: [NotificationEventsController],
  exports: [ClientsModule, NotificationClientService],
  providers: [NotificationClientService],
})
export class NotificationClientModule {}
