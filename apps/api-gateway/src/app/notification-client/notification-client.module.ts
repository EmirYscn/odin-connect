import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  NOTIFICATION_SERVICE_RABBITMQ,
  NOTIFICATION_SERVICE_NOTIFICATION_QUEUE,
} from '@odin-connect-monorepo/types';
import { NotificationEventsController } from './notification-events.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { EventsModule } from '../events/events.module';
import { NotificationClientService } from './notification-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NOTIFICATION_SERVICE_RABBITMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: NOTIFICATION_SERVICE_NOTIFICATION_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
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
