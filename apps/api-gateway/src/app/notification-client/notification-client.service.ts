import { Inject, Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';

import {
  NOTIFICATION_SERVICE_RABBITMQ,
  RabbitMQNotificationEvent,
} from '@odin-connect-monorepo/types';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_TYPE } from '@prisma/client';
import { emitMQEvent } from '../common/utils/mq-functions';

@Injectable()
export class NotificationClientService {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(NOTIFICATION_SERVICE_RABBITMQ)
    private readonly client: ClientProxy
  ) {}

  async tryCreatePostRelatedNotification(
    userId: string,
    postId: string,
    event: keyof RabbitMQNotificationEvent,
    type: NOTIFICATION_TYPE
  ) {
    // check for an existing user-post notification type like
    // if it exists and if its createdAt field is less than 24 hours ago, do not create a new notification
    const isNotificationCreatedRecently =
      await this.notificationsService.checkNotificationCreatedRecently(
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
}
