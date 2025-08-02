import { Injectable } from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookmarksByUserId(userId: string) {
    return await this.prisma.bookmark.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            user: true,
            _count: {
              select: {
                likes: true,
                replies: true,
                bookmarks: true,
                reposts: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
