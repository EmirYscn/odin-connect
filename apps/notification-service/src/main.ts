/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE_NOTIFICATION_QUEUE } from '@odin-connect-monorepo/types';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://user:password@localhost:5672'],
        queue: NOTIFICATION_SERVICE_NOTIFICATION_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    }
  );

  await app.listen();
  Logger.log(`🚀 Application is listening on RabbitMQ`);
}

bootstrap();
