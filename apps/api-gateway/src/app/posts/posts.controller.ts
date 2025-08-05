import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostsService } from './posts.service';

import type { User as UserType } from '@prisma/client';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { isLikedByCurrentUserInterceptor } from './interceptors/isLikedByCurrentUser.interceptor';
import { Auth } from '../common/decorators/auth.decorator';
import { FileCountValidationPipe } from '../common/pipes/file-count-validation.pipe';
import { FileTypeValidationPipe } from '../common/pipes/file-type-validation.pipe';
import { FileSizeValidationPipe } from '../common/pipes/file-size-validation.pipe';
import { ImageCompressionPipe } from '../common/pipes/image-compression.pipe';
import type { UploadFilesMap } from '../common/types/upload-files.type';
import { User } from '../common/decorators/user.decorator';

@Controller('posts')
@Auth()
@UseInterceptors(isLikedByCurrentUserInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'postMedia' }]))
  @UsePipes(ValidationPipe)
  createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles(
      FileCountValidationPipe,
      FileTypeValidationPipe,
      FileSizeValidationPipe,
      ImageCompressionPipe
    )
    files: UploadFilesMap,
    @User() user: UserType
  ) {
    const { postMedia } = files;
    return this.postsService.createPost(user.id, createPostDto, postMedia);
  }

  @Get('foryou')
  getForYouPosts(
    @Query('cursor', new DefaultValuePipe(0)) cursor: number,
    @User() user: UserType
  ) {
    // console.log('Cursor:', cursor);
    // if (!cursor) {
    //   throw new BadRequestException('Cursor is required');
    // }
    return this.postsService.getForYouPosts();
  }

  @Get('following')
  getFollowingPosts(@User() user: UserType) {
    return this.postsService.getFollowingPosts(user.id);
  }

  @Get('profile/:id')
  getUserPosts(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Profile ID is required');
    }
    return this.postsService.getProfilePosts(id);
  }

  @Get(':id')
  async getPost(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Post ID is required');
    }
    return await this.postsService.getPostById(id);
  }

  @Get(':id/replies')
  async getReplies(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Post ID is required');
    }
    return await this.postsService.getRepliesByPostId(id);
  }

  @Get('profile/:id/replies')
  async getProfileReplies(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('Profile ID is required');
    }
    return await this.postsService.getProfileReplies(id);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string, @User() user: UserType) {
    if (!id) {
      throw new BadRequestException('Post ID is required');
    }
    return this.postsService.deletePostById(id, user.id);
  }
}
