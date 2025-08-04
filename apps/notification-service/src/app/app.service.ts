import { Injectable } from '@nestjs/common';
import { NotificationsService } from './notifications/notifications.service';
import { PostLikedDto } from './dtos/post-liked.dto';

@Injectable()
export class AppService {
  constructor(private readonly notificationsService: NotificationsService) {}

  handlePostLiked(data: PostLikedDto) {
    const { actorId, postId } = data;
    console.log(
      `Handling post liked event for postId: ${postId} by actorId: ${actorId}`
    );
    // get the post and actor details

    // create a notification

    // emit notification event to the user
    return;
  }
}
