import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';

import { ClientProxy } from '@nestjs/microservices';
import { emitMQEvent } from '../common/utils/mq-functions';
import { NOTIFICATION_SERVICE_RABBITMQ } from '@odin-connect-monorepo/types';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    @Inject(NOTIFICATION_SERVICE_RABBITMQ)
    private readonly client: ClientProxy
  ) {}

  async likePost(postId: string, userId: string) {
    const hasLiked = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (hasLiked) {
      return this.prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    }

    const like = this.prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    // check for an existing user-post notification type like
    // if it exists and if its createdAt field is less than 24 hours ago, do not create a new notification
    const isNotificationCreatedRecently =
      await this.notificationsService.checkNotificationCreatedRecently(
        userId,
        postId,
        'LIKE'
      );

    if (!isNotificationCreatedRecently) {
      emitMQEvent(this.client, 'post:liked', {
        actorId: userId,
        postId,
      });
    }

    return like;
  }
}
