import { Inject, Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications/notifications.service';
import { PostLikedDto } from './dtos/post-liked.dto';
import { ClientProxy } from '@nestjs/microservices';
import { API_GATEWAY_RABBITMQ } from '@odin-connect-monorepo/types';
import { emitMQEvent } from './common/utils/mq-functions';
import { PostRepostedDto } from './dtos/post-reposted.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(API_GATEWAY_RABBITMQ) private readonly client: ClientProxy
  ) {}

  async handlePostLiked(data: PostLikedDto) {
    const { actorId, postId } = data;
    console.log(
      `Handling post liked event for postId: ${postId} by actorId: ${actorId}`
    );
    // create a notification
    const notification =
      await this.notificationsService.createPostLikedNotification(
        actorId,
        postId
      );

    if (notification) {
      // emit notification event to the user
      emitMQEvent(this.client, 'notification:created', {
        notificationId: notification.id,
      });
    }
    return;
  }

  async handlePostReposted(data: PostRepostedDto) {
    const { actorId, postId } = data;
    console.log(
      `Handling post reposted event for postId: ${postId} by actorId: ${actorId}`
    );

    // create a notification
    const notification =
      await this.notificationsService.createPostRepostedNotification(
        actorId,
        postId
      );

    if (notification) {
      // emit notification event to the user
      emitMQEvent(this.client, 'notification:created', {
        notificationId: notification.id,
      });
    }
    return;
  }

  async handlePostReplied(data: PostLikedDto) {
    const { actorId, postId } = data;
    console.log(
      `Handling post replied event for postId: ${postId} by actorId: ${actorId}`
    );

    // create a notification
    const notification =
      await this.notificationsService.createPostRepliedNotification(
        actorId,
        postId
      );

    if (notification) {
      // emit notification event to the user
      emitMQEvent(this.client, 'notification:created', {
        notificationId: notification.id,
      });
    }
    return;
  }
}
