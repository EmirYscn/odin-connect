import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@odin-connect-monorepo/prisma';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationClientModule } from './notification-client/notification-client.module';
import envValidation from './config/env.validation';
import appConfig from './config/app.config';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    PrismaModule,
    NotificationsModule,
    NotificationClientModule,
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
