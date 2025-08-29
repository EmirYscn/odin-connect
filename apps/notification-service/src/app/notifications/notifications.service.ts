import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createPostLikedNotification(actorId: string, postId: string) {
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

    const message = `${actor.displayName} has liked your ${
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

  async createPostRepostedNotification(actorId: string, postId: string) {
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

    const message = `${actor.displayName} has reposted your ${
      isPostAReply ? 'reply' : 'post'
    }`;

    return this.prisma.notification.create({
      data: {
        type: 'REPOST',
        message,
        userId: postOwnerId,
        postId,
        actorId,
      },
    });
  }

  async createPostRepliedNotification(actorId: string, postId: string) {
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

    const message = `${actor.displayName} has replied to your ${
      isPostAReply ? 'reply' : 'post'
    }`;

    return this.prisma.notification.create({
      data: {
        type: 'REPLY',
        message,
        userId: postOwnerId,
        postId,
        actorId,
      },
    });
  }

  async createUserFollowedNotification(actorId: string, userId: string) {
    const actor = await this.prisma.user.findUnique({
      where: { id: actorId },
      select: { displayName: true },
    });
    if (!actor) {
      throw new NotFoundException(`User with ID ${actorId} not found`);
    }

    const followedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { displayName: true },
    });
    if (!followedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const message = `${actor.displayName} followed you`;

    return this.prisma.notification.create({
      data: {
        type: 'FOLLOW',
        message,
        userId,
        actorId,
      },
    });
  }
}
