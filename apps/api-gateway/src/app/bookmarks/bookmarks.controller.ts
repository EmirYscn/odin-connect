import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { Auth } from '../common/decorators/auth.decorator';
import { User } from '../common/decorators/user.decorator';
import type { User as UserType } from '@prisma/client';
import { BookmarkPostDto } from './dtos/bookmark-post.dto';
import { IsLikedByCurrentUserInterceptor } from '../common/interceptors/isLikedByCurrentUser.interceptor';
import { IsRepostedByCurrentUserInterceptor } from '../common/interceptors/isRepostedByCurrentUser.interceptor';
import { IsBookmarkedByCurrentUserInterceptor } from '../common/interceptors/isBookmarkedByCurrentUser.interceptor';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @Auth()
  @UseInterceptors(
    IsLikedByCurrentUserInterceptor,
    IsRepostedByCurrentUserInterceptor,
    IsBookmarkedByCurrentUserInterceptor
  )
  async getBookmarks(@Query('cursor') cursor: string, @User() user: UserType) {
    return this.bookmarksService.getBookmarksByUserId(user.id, cursor);
  }

  @Post()
  @Auth()
  async createBookmark(
    @Body() bookmarkPostDto: BookmarkPostDto,
    @User() user: UserType
  ) {
    return this.bookmarksService.bookmarkPost(bookmarkPostDto.postId, user.id);
  }
}
