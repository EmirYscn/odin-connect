import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

import {
  NOTIFICATION_SERVICE_RABBITMQ,
  PostEvent,
  UserEvent,
} from '@odin-connect-monorepo/types';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_TYPE } from '@prisma/client';
import { emitMQEvent } from '../common/utils/mq-functions';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class NotificationClientService {
  constructor(
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
    private readonly notificationsService: NotificationsService,
    @Inject(NOTIFICATION_SERVICE_RABBITMQ)
    private readonly client: ClientProxy
  ) {}

  async tryCreatePostRelatedNotification(
    userId: string,
    postId: string,
    event: keyof PostEvent,
    type: NOTIFICATION_TYPE
  ) {
    // check to see if related post is not the user's own post
    const postOwnerId = await this.postsService.getPostOwnerId(postId);
    if (postOwnerId === userId) return;

    // check for an existing user-post notification type like
    // if it exists and if its createdAt field is less than 24 hours ago, do not create a new notification
    const isNotificationCreatedRecently =
      await this.notificationsService.checkPostRelatedNotificationCreatedRecently(
        userId,
        postId,
        type
      );

    if (!isNotificationCreatedRecently) {
      emitMQEvent(this.client, event, {
        actorId: userId,
        postId,
      });
    }
  }

  async tryCreateUserRelatedNotification(
    actorId: string,
    userId: string,
    event: keyof UserEvent,
    type: NOTIFICATION_TYPE
  ) {
    // prevent self-notifications
    if (actorId === userId) return;

    const isNotificationCreatedRecently =
      await this.notificationsService.checkUserRelatedNotificationCreatedRecently(
        actorId,
        userId,
        type
      );

    if (!isNotificationCreatedRecently) {
      emitMQEvent(this.client, event, {
        actorId,
        userId,
      });
    }
  }
}
