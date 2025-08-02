import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { map, Observable } from 'rxjs';

/**
 * Omits the password field from a user object.
 * @param user - The user object from which to omit the password.
 * @returns A new object without the password field.
 */

function omitPassword(user: User) {
  if (!user || typeof user !== 'object') return user;
  const { password: _, ...rest } = user;
  return rest;
}

type Data = User[] | User | { user: User };

@Injectable()
export class UsersInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<User[] | User>
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: Data) => {
        if (Array.isArray(data)) {
          return data.map(omitPassword);
        }
        // If data is a single user
        if (data && typeof data === 'object') {
          // Omit password if user is nested
          if ('user' in data && typeof data.user === 'object') {
            return { ...data, user: omitPassword(data.user) };
          }
          // Omit password if user is top-level
          if ('password' in data) {
            return omitPassword(data);
          }
        }
        return data;
      })
    );
  }
}
