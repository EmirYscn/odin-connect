import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Prisma, Profile, User } from '@prisma/client';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

export type FullProfile = Prisma.ProfileGetPayload<{
  include: {
    user: {
      select: {
        followers: { select: { followerId: true } };
        following: { select: { followingId: true } };
      };
    };
  };
}>;

function handleIsFollowedByField(
  profile: FullProfile,
  currentUserId: string
): any {
  if (!profile || typeof profile !== 'object') return profile;
  const isFollowedByCurrentUser = profile.user.followers.some(
    (follower) => follower.followerId === currentUserId
  );

  //   console.log(`Current User ID: ${currentUserId}`);
  //   console.log(`Followers: ${profile.user.followers.map((f) => f.followerId)}`);
  //   console.log(`Is followed by current user: ${isFollowedByCurrentUser}`);

  return {
    ...profile,
    isFollowedByCurrentUser,
  };
}

type Data = Profile;

export class IsFollowedByCurrentUserInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const currentUserId = (request.user as User)?.id;

    return next.handle().pipe(
      map((data: Data) => {
        console.log('INSIDE INTERCEPTOR');
        // Single Profile
        if (data && typeof data === 'object') {
          return handleIsFollowedByField(data as FullProfile, currentUserId);
        }
        return data;
      })
    );
  }
}
