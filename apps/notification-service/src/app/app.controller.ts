import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PostLikedDto } from './dtos/post-liked.dto';
import { NotificationServiceConsumeEvent } from '@odin-connect-monorepo/types';
import { UserFollowedDto } from './dtos/user-followed.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern<keyof NotificationServiceConsumeEvent>('post:liked')
  handlePostLiked(@Payload() data: PostLikedDto) {
    console.log('[Notification-Service]: Recevied post liked event: ', data);
    return this.appService.handlePostLiked(data);
  }

  @MessagePattern<keyof NotificationServiceConsumeEvent>('post:reposted')
  handlePostReposted(@Payload() data: PostLikedDto) {
    console.log('[Notification-Service]: Recevied post reposted event: ', data);
    return this.appService.handlePostReposted(data);
  }

  @MessagePattern<keyof NotificationServiceConsumeEvent>('post:replied')
  handlePostReplied(@Payload() data: PostLikedDto) {
    console.log('[Notification-Service]: Recevied post replied event: ', data);
    return this.appService.handlePostReplied(data);
  }

  @MessagePattern<keyof NotificationServiceConsumeEvent>('user:followed')
  handleUserFollowed(@Payload() data: UserFollowedDto) {
    console.log('[Notification-Service]: Recevied post replied event: ', data);
    return this.appService.handleUserFollowed(data);
  }
}
