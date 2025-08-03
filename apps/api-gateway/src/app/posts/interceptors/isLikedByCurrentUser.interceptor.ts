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
  };
}>;

function handleIsLikedByField(post: FullPost, currentUserId: string) {
  if (!post || typeof post !== 'object') return post;
  console.log('Post Id:', post.id);
  console.log('Current User Id:', currentUserId);
  console.log(post);
  const isLikedByCurrentUser = post.likes.some(
    (like) => like.userId === currentUserId
  );
  return {
    ...post,
    isLikedByCurrentUser,
  };
}

type Data = Post[] | Post;

@Injectable()
export class isLikedByCurrentUserInterceptor implements NestInterceptor {
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
            handleIsLikedByField(post as FullPost, currentUserId)
          );
        }
        if (data && typeof data === 'object') {
          return handleIsLikedByField(data as FullPost, currentUserId);
        }
        return data;
      })
    );
  }
}
