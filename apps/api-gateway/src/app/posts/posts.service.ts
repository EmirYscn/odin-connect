import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Post } from '@prisma/client';

import { UsersService } from '../users/users.service';
import { MediaService } from '../media/media.service';
import { EventsGateway } from '../events/events.gateway';
import { NotificationClientService } from '../notification-client/notification-client.service';

import { FullPost } from '@odin-connect-monorepo/types';
import { PrismaService } from '@odin-connect-monorepo/prisma';

import { CreatePostDto } from './dtos/create-post.dto';

import {
  postInclude,
  postWithParentAndRepostOfInclude,
  postWithParentInclude,
  postWithRepostOfInclude,
} from '../common/types/prismaIncludes';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly mediaService: MediaService,
    @Inject(forwardRef(() => NotificationClientService))
    private readonly notificationPub: NotificationClientService
  ) {}

  async createPost(
    userId: string,
    data: CreatePostDto,
    postMedias: Express.Multer.File[]
  ) {
    // Validate user exists
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const createdPost = await this.prisma.post.create({
      data: {
        ...data,
        userId: user.id,
        parentId: data.parentId || null, // Presence of parentId indicates a reply
      },
    });

    if (postMedias && postMedias.length > 0) {
      // create post medias by calling the media service
      await this.mediaService.createPostMedia(
        createdPost.id,
        user.id,
        postMedias
      );
    }

    const fullPost = await this.prisma.post.findUnique({
      where: { id: createdPost.id },
      include: postWithParentAndRepostOfInclude,
    });
    if (!fullPost) {
      throw new InternalServerErrorException('Failed to retrieve created post');
    }

    // Presence of parentId indicates a reply
    if (data.parentId) {
      // Try to create a notification for the reply event
      await this.notificationPub.tryCreatePostRelatedNotification(
        userId,
        data.parentId,
        'post:replied',
        'REPLY'
      );
    }

    this.eventsGateway.broadcastToAll('post:created', fullPost as FullPost);

    return fullPost;
  }

  async repostPost(
    userId: string,
    postId: string,
    data?: CreatePostDto,
    postMedias?: Express.Multer.File[]
  ) {
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

    // Validate post exists
    const hasReposted = await this.prisma.post.findFirst({
      where: {
        userId: user.id,
        repostOfId: postId,
      },
    });

    if (hasReposted) {
      await this.prisma.post.delete({
        where: {
          id: hasReposted.id,
        },
      });
      return { deleted: true };
    }

    const createdPost = await this.prisma.post.create({
      data: {
        ...data,
        userId: user.id, // Ensure the post is associated with the correct user
        repostOfId: postId, // Set the repostOfId to the original post ID
      },
    });

    if (postMedias && postMedias.length > 0) {
      // create post medias by calling the media service
      await this.mediaService.createPostMedia(
        createdPost.id,
        user.id,
        postMedias
      );
    }

    const fullPost = await this.prisma.post.findUnique({
      where: { id: createdPost.id },
      include: postInclude,
    });

    if (!fullPost) {
      throw new InternalServerErrorException('Failed to retrieve created post');
    }

    // Try to create a notification for the repost event
    await this.notificationPub.tryCreatePostRelatedNotification(
      userId,
      postId,
      'post:reposted',
      'REPOST'
    );

    this.eventsGateway.broadcastToAll('post:created', fullPost as FullPost);

    return fullPost;
  }

  async getForYouPosts(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        // parentId: null, // Only get top-level posts
        published: true,
      },
      include: postWithParentAndRepostOfInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  }

  async getFollowingPosts(userId: string): Promise<Post[]> {
    // 1. Get the IDs of users the current user is following
    const following = await this.prisma.userFollowing.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = following.map((f) => f.followingId);

    // 2. Get posts from those users
    return await this.prisma.post.findMany({
      where: {
        userId: {
          in: followingIds,
        },
        // parentId: null, // Only get top-level posts
        published: true,
      },
      include: postWithParentAndRepostOfInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getProfilePosts(username: string): Promise<Post[]> {
    // Validate user exists
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userId = user.id;
    const posts = await this.prisma.post.findMany({
      where: {
        userId,
        parentId: null, // Only get top-level posts
        published: true,
      },
      include: postWithRepostOfInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  }

  async getProfileReplies(username: string): Promise<Post[]> {
    // Validate user exists
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const userId = user.id;
    const replies = await this.prisma.post.findMany({
      where: {
        userId,
        parentId: {
          not: null, // Only get replies (posts with a parent)
        },
      },
      include: postWithParentInclude,
      orderBy: { createdAt: 'desc' },
    });
    return replies;
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: postWithParentAndRepostOfInclude,
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    return post;
  }

  async getRepliesByPostId(postId: string): Promise<Post[]> {
    const replies = await this.prisma.post.findMany({
      where: { parentId: postId },
      include: postInclude,
      orderBy: { createdAt: 'desc' },
    });

    return replies;
  }

  async deletePostById(id: string, userId: string) {
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
      include: {
        medias: {
          select: {
            id: true,
            filePath: true,
          },
        },
      },
    });

    if (!existingPost) {
      throw new BadRequestException('Post not found');
    }

    const isSameUser = existingPost.userId === userId;
    if (!isSameUser) {
      throw new UnauthorizedException('You can only delete your own posts');
    }

    // Delete associated media files
    if (existingPost.medias && existingPost.medias.length > 0) {
      await this.mediaService.deletePostMedias(existingPost.medias);
    }

    // Delete the post
    try {
      await this.prisma.post.delete({
        where: { id },
      });
    } catch {
      throw new InternalServerErrorException(`Failed to delete post`);
    }
  }

  async getPostOwnerId(postId: string): Promise<string> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    return post?.userId || '';
  }
}
