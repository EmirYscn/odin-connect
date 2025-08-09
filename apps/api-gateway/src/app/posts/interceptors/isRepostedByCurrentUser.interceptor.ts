import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Post, Prisma, User } from '@prisma/client';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

type FullPost = Prisma.PostGetPayload<{
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

function handleIsRepostedByField(post: FullPost, currentUserId: string): any {
  if (!post || typeof post !== 'object') return post;
  const isRepostedByCurrentUser = Array.isArray(post.reposts)
    ? post.reposts.some((repost) => repost.userId === currentUserId)
    : false;

  // Recursively handle nested repostOf
  let repostOf = post.repostOf;
  if (repostOf && typeof repostOf === 'object') {
    repostOf = handleIsRepostedByField(repostOf as FullPost, currentUserId);
  }

  return {
    ...post,
    isRepostedByCurrentUser,
    ...(repostOf && { repostOf }), // Only include if exists
  };
}

type Data = Post[] | Post;

@Injectable()
export class isRepostedByCurrentUser implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<Post[] | Post>
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const currentUserId = (request.user as User)?.id;

    return next.handle().pipe(
      map((data: Data) => {
        if (Array.isArray(data)) {
          return data.map((post) =>
            handleIsRepostedByField(post as FullPost, currentUserId)
          );
        }
        if (data && typeof data === 'object') {
          return handleIsRepostedByField(data as FullPost, currentUserId);
        }
        return data;
      })
    );
  }
}
