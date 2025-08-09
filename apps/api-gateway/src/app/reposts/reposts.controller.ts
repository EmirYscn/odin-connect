// import { Body, Controller, Get, Param, Post } from '@nestjs/common';
// import { RepostsService } from './reposts.service';
// import { Auth } from '../common/decorators/auth.decorator';
// import { User } from '../common/decorators/user.decorator';
// import type { User as UserType } from '@prisma/client';
// import { CreateRepostDto } from './dtos/create-repost.dto';

// @Controller('reposts')
// export class RepostsController {
//   constructor(private readonly repostsService: RepostsService) {}

//   @Get('profile/:id')
//   @Auth()
//   async getProfileReposts(@Param('id') id: string) {
//     return this.repostsService.getProfileReposts(id);
//   }

//   @Post()
//   @Auth()
//   async createRepost(
//     @User() user: UserType,
//     @Body() createRepostDto: CreateRepostDto
//   ) {
//     return this.repostsService.createRepost(user.id, createRepostDto.postId);
//   }
// }
