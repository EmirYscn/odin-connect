import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
// import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new GlobalExceptionFilter());

  const configService = app.get(ConfigService);
  const clientUrl = configService.get<string>('appConfig.clientUrl');
  const port = configService.get<number>('appConfig.port') || 3000;

  Logger.log(`API Gateway running on port ${port}`, 'Bootstrap');
  Logger.log(
    `Node environment: ${configService.get('appConfig.environment')}`,
    'Bootstrap'
  );

  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(helmet());
  app.enableCors({
    origin: clientUrl,
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
