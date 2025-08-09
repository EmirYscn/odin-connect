import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PostLikedDto } from './dtos/post-liked.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('post:liked')
  handlePostLiked(@Payload() data: PostLikedDto) {
    console.log('[Notification-Service]: Recevied post liked event: ', data);
    return this.appService.handlePostLiked(data);
  }

  @MessagePattern('post:reposted')
  handlePostReposted(@Payload() data: PostLikedDto) {
    console.log('[Notification-Service]: Recevied post reposted event: ', data);
    return this.appService.handlePostReposted(data);
  }
}
