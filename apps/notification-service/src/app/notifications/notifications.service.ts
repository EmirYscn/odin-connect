import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPostRelatedNotification(actorId: string, postId: string) {
    const actor = await this.prisma.user.findUnique({
      where: { id: actorId },
      select: { displayName: true },
    });
    if (!actor) {
      throw new NotFoundException(`User with ID ${actorId} not found`);
    }

    const relatedPost = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { parentId: true, userId: true },
    });
    if (!relatedPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const postOwnerId = relatedPost.userId;
    const isPostAReply = relatedPost?.parentId ? true : false;

    const message = `User ${actor.displayName} has liked your ${
      isPostAReply ? 'reply' : 'post'
    }`;

    return this.prisma.notification.create({
      data: {
        type: 'LIKE',
        message,
        userId: postOwnerId,
        postId,
        actorId,
      },
    });
  }
}
