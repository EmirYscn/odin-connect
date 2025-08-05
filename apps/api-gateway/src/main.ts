import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './app/common/filters/global-exception.filter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { API_GATEWAY_NOTIFICATION_QUEUE } from '@odin-connect-monorepo/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: API_GATEWAY_NOTIFICATION_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  const clientUrl = configService.get<string>('appConfig.clientUrl');
  const port = configService.get<number>('appConfig.port') || 3000;
  const environment = configService.get<string>('appConfig.environment');

  Logger.log(`API Gateway running on port ${port}`, 'Bootstrap');
  Logger.log(`Node environment: ${environment}`, 'Bootstrap');

  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(helmet());
  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
