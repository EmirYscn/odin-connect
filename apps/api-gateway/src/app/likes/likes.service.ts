import { Injectable } from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.like.create({
      data: {
        userId,
        postId,
      },
    });
  }
}
