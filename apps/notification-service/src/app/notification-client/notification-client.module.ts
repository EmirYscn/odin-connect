import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  API_GATEWAY_RABBITMQ,
  API_GATEWAY_NOTIFICATION_QUEUE,
} from '@odin-connect-monorepo/types';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: API_GATEWAY_RABBITMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: API_GATEWAY_NOTIFICATION_QUEUE,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NotificationClientModule {}
