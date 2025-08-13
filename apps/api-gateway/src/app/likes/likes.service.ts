import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';
import { NotificationClientService } from '../notification-client/notification-client.service';

@Injectable()
export class LikesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationPub: NotificationClientService
  ) {}

  async likePost(postId: string, userId: string) {
    // Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // Validate post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

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

    await this.notificationPub.tryCreatePostRelatedNotification(
      userId,
      postId,
      'post:liked',
      'LIKE'
    );

    return like;
  }
}
