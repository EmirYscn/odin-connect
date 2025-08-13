import { Bookmark, Post, Prisma } from '@prisma/client';

export type FullPost = Prisma.PostGetPayload<{
  include: {
    user: true;
    replies: true;
    likes: true;
    bookmarks: true;
    reposts: true;
    medias: true;
    parent: true;
    repostOf: true;
  };
}>;

export type BookmarkWithPost = Bookmark & { post: FullPost };
export type BookmarkWithPostArray = BookmarkWithPost[];
export type PostArray = Post[];
export type Data = Post | PostArray | BookmarkWithPost | BookmarkWithPostArray;
