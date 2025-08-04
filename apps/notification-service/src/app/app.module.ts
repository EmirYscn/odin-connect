import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@odin-connect-monorepo/prisma';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
