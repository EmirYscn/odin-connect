import { Injectable, OnModuleInit } from '@nestjs/common';
import cron from 'node-cron';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CronService implements OnModuleInit {
  constructor(private readonly notificationsService: NotificationsService) {}

  onModuleInit() {
    cron.schedule('0 0 * * *', async () => {
      // This cron job runs every day at midnight and deletes notifications older than 14 days
      const days = 14;

      const deletedNotificationCount =
        await this.notificationsService.deleteNotificationsOlderThanXDays(days);
      const hasFoundOldNotifications = deletedNotificationCount > 0;

      console.log(
        `[APIGATEWAY:CRON] - ${new Date().toLocaleString()} - Found ${
          hasFoundOldNotifications ? deletedNotificationCount : 'no'
        } notifications older than ${days} days - ${
          hasFoundOldNotifications
            ? `Deleted ${hasFoundOldNotifications}`
            : 'Did not delete any'
        } notifications`
      );
    });
  }
}
