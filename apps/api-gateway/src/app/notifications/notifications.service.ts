import { Injectable } from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';
import { Notification, NOTIFICATION_TYPE } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            profile: { select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNotificationById(
    notificationId: string
  ): Promise<Notification | null> {
    return await this.prisma.notification.findUnique({
      where: { id: notificationId },
      include: {
        user: true,
        post: true, // Include post if the notification is related to a post
        actor: true,
      },
    });
  }

  async checkNotificationCreatedRecently(
    actorId: string,
    postId: string,
    type: NOTIFICATION_TYPE
  ): Promise<boolean> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingNotification = await this.prisma.notification.findFirst({
      where: {
        actorId,
        postId,
        type,
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });

    return !!existingNotification;
  }

  async getUnreadNotificationsCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }
}
