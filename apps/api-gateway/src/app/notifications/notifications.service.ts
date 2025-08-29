import { Injectable } from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';
import { Notification, NOTIFICATION_TYPE } from '@prisma/client';

const LIMIT = 20;

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(
    userId: string,
    cursor?: string
  ): Promise<{
    notifications: Notification[];
    nextCursor?: string;
  }> {
    const notifications = await this.prisma.notification.findMany({
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
      take: LIMIT + 1, // Fetch one extra to check if there's a next page
      skip: 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: string | undefined = undefined;
    if (notifications.length > LIMIT) {
      const nextItem = notifications.pop(); // Remove the extra item
      nextCursor = nextItem?.id;
    }

    return {
      notifications,
      nextCursor,
    };
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

  async checkPostRelatedNotificationCreatedRecently(
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

  async checkUserRelatedNotificationCreatedRecently(
    actorId: string,
    userId: string,
    type: NOTIFICATION_TYPE
  ): Promise<boolean> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingNotification = await this.prisma.notification.findFirst({
      where: {
        actorId,
        userId,
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

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async deleteNotificationsOlderThanXDays(days: number) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const notifications = await this.prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return notifications.count;
  }
}
