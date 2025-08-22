import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  API_GATEWAY_RABBITMQ,
  API_GATEWAY_NOTIFICATION_QUEUE,
} from '@odin-connect-monorepo/types';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: API_GATEWAY_RABBITMQ,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')!],
            queue: API_GATEWAY_NOTIFICATION_QUEUE,
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NotificationClientModule {}
