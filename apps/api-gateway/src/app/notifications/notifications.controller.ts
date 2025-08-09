import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { User } from '../common/decorators/user.decorator';
import type { User as UserType } from '@prisma/client';
import { Auth } from '../common/decorators/auth.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Auth()
  async getNotifications(@User() user: UserType) {
    return this.notificationsService.getNotifications(user.id);
  }

  @Get('unread-count')
  @Auth()
  async getUnreadNotificationsCount(@User() user: UserType) {
    const unreadNotificationsCount =
      await this.notificationsService.getUnreadNotificationsCount(user.id);
    return unreadNotificationsCount;
  }
}
