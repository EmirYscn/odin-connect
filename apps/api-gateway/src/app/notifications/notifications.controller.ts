import { Controller, Get, Post, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { User } from '../common/decorators/user.decorator';
import type { User as UserType } from '@prisma/client';
import { Auth } from '../common/decorators/auth.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Auth()
  async getNotifications(
    @Query('cursor') cursor: string,
    @User() user: UserType
  ) {
    return this.notificationsService.getNotifications(user.id, cursor);
  }

  @Get('unread-count')
  @Auth()
  async getUnreadNotificationsCount(@User() user: UserType) {
    const unreadNotificationsCount =
      await this.notificationsService.getUnreadNotificationsCount(user.id);
    return unreadNotificationsCount;
  }

  @Post('mark-all-as-read')
  @Auth()
  async markAllNotificationsAsRead(@User() user: UserType) {
    return this.notificationsService.markAllNotificationsAsRead(user.id);
  }
}
