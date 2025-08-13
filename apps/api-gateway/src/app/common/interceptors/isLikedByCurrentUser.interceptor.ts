import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import {
  BookmarkWithPost,
  BookmarkWithPostArray,
  Data,
  FullPost,
  PostArray,
} from './types/types';

function handleIsLikedByField(post: FullPost, currentUserId: string): any {
  if (!post || typeof post !== 'object') return post;
  const isLikedByCurrentUser = Array.isArray(post.likes)
    ? post.likes.some((like) => like.userId === currentUserId)
    : false;

  // Recursively handle nested repostOf
  let repostOf = post.repostOf;
  if (repostOf && typeof repostOf === 'object') {
    repostOf = handleIsLikedByField(repostOf as FullPost, currentUserId);
  }

  // Recursively handle nested parent
  let parent = post.parent;
  if (parent && typeof parent === 'object') {
    parent = handleIsLikedByField(parent as FullPost, currentUserId);
  }

  return {
    ...post,
    isLikedByCurrentUser,
    ...(repostOf && { repostOf }), // Only include if exists
    ...(parent && { parent }), // Only include if exists
  };
}

@Injectable()
export class IsLikedByCurrentUserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<Post[] | Post>
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
          console.log('INSIDE BOOKMARKS HANDLER');
          const { bookmarks, nextCursor } = data as {
            bookmarks: BookmarkWithPostArray;
            nextCursor?: string;
          };
          const updatedData = {
            bookmarks: bookmarks.map((bookmark) => ({
              ...bookmark,
              post: handleIsLikedByField(
                bookmark.post as FullPost,
                currentUserId
              ),
            })),
            nextCursor,
          };

          return updatedData;
        }

        if (Array.isArray(data)) {
          // Check if it's an array of bookmarks with post
          if (data.length > 0 && 'post' in data[0]) {
            // It's BookmarkWithPostArray
            return (data as BookmarkWithPostArray).map((bookmark) =>
              handleIsLikedByField(bookmark.post as FullPost, currentUserId)
            );
          } else {
            // It's PostArray
            return (data as PostArray).map((post) =>
              handleIsLikedByField(post as FullPost, currentUserId)
            );
          }
        }
        // Single BookmarkWithPost
        if (data && typeof data === 'object' && 'post' in data) {
          return handleIsLikedByField(
            (data as BookmarkWithPost).post,
            currentUserId
          );
        }
        // Single Post
        if (data && typeof data === 'object') {
          return handleIsLikedByField(data as FullPost, currentUserId);
        }
        return data;
      })
    );
  }
}
