import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import {
  BookmarkWithPost,
  BookmarkWithPostArray,
  Data,
  FullPost,
  PostArray,
} from './types/types';

function handleIsBookmarkedByField(post: FullPost, currentUserId: string): any {
  if (!post || typeof post !== 'object') return post;
  const isBookmarkedByCurrentUser = Array.isArray(post.bookmarks)
    ? post.bookmarks.some((bookmark) => bookmark.userId === currentUserId)
    : false;

  // Recursively handle nested repostOf
  let repostOf = post.repostOf;
  if (repostOf && typeof repostOf === 'object') {
    repostOf = handleIsBookmarkedByField(repostOf as FullPost, currentUserId);
  }

  // Recursively handle nested parent
  let parent = post.parent;
  if (parent && typeof parent === 'object') {
    parent = handleIsBookmarkedByField(parent as FullPost, currentUserId);
  }

  return {
    ...post,
    isBookmarkedByCurrentUser,
    ...(repostOf && { repostOf }), // Only include if exists
    ...(parent && { parent }), // Only include if exists
  };
}

export class IsBookmarkedByCurrentUserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    const currentUserId = (request.user as User)?.id;

    const controller = context.getClass();
    const isBookmarksController = controller.name === 'BookmarksController';

    return next.handle().pipe(
      map((data: Data) => {
        // Handle paginated bookmarks object
        if (
          isBookmarksController &&
          data &&
          typeof data === 'object' &&
          'bookmarks' in data &&
          Array.isArray((data as any).bookmarks)
        ) {
          const { bookmarks, nextCursor } = data as {
            bookmarks: BookmarkWithPostArray;
            nextCursor?: string;
          };

          const updateData = {
            bookmarks: bookmarks.map((bookmark) => ({
              ...bookmark,
              post: handleIsBookmarkedByField(
                bookmark.post as FullPost,
                currentUserId
              ),
            })),
            nextCursor,
          };

          return updateData;
        }

        if (Array.isArray(data)) {
          // Check if it's an array of bookmarks with post
          if (data.length > 0 && 'post' in data[0]) {
            // It's BookmarkWithPostArray
            return (data as BookmarkWithPostArray).map((bookmark) =>
              handleIsBookmarkedByField(
                bookmark.post as FullPost,
                currentUserId
              )
            );
          } else {
            // It's PostArray
            return (data as PostArray).map((post) =>
              handleIsBookmarkedByField(post as FullPost, currentUserId)
            );
          }
        }
        // Single BookmarkWithPost
        if (data && typeof data === 'object' && 'post' in data) {
          return handleIsBookmarkedByField(
            (data as BookmarkWithPost).post,
            currentUserId
          );
        }
        // Single Post
        if (data && typeof data === 'object') {
          return handleIsBookmarkedByField(data as FullPost, currentUserId);
        }
        return data;
      })
    );
  }
}
