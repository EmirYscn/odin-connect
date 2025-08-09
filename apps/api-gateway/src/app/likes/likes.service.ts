import { Injectable } from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';
import { NotificationClientService } from '../notification-client/notification-client.service';

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationPub: NotificationClientService
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

    // Try to create a notification for the like event
    await this.notificationPub.tryCreatePostRelatedNotification(
      userId,
      postId,
      'post:liked',
      'LIKE'
    );

    return like;
  }
}
