import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';
import { Bookmark } from '@prisma/client';
import { postWithRepostOfInclude } from '../common/types/prismaIncludes';

const LIMIT = 10;

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookmarksByUserId(
    userId: string,
    cursor?: string
  ): Promise<{
    bookmarks: Bookmark[];
    nextCursor?: string;
  }> {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      include: {
        post: {
          include: postWithRepostOfInclude,
        },
      },
      take: LIMIT + 1, // Fetch one extra to check if there's a next page
      skip: 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    let nextCursor: string | undefined = undefined;
    if (bookmarks.length > LIMIT) {
      const nextItem = bookmarks.pop(); // Remove the extra item
      nextCursor = nextItem?.id;
    }

    return {
      bookmarks,
      nextCursor,
    };
  }

  async bookmarkPost(postId: string, userId: string): Promise<Bookmark> {
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

    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingBookmark) {
      return this.prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    }

    return this.prisma.bookmark.create({
      data: {
        userId,
        postId,
      },
    });
  }
}
