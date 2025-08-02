import { Body, Controller, Post } from '@nestjs/common';
import { LikesService } from './likes.service';

import type { User as UserType } from '@prisma/client';
import { LikePostDto } from './dtos/like-post.dto';
import { Auth } from '../common/decorators/auth.decorator';
import { User } from '../common/decorators/user.decorator';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @Auth()
  likePost(@User() user: UserType, @Body() likePostDto: LikePostDto) {
    return this.likesService.likePost(likePostDto.postId, user.id);
  }
}
