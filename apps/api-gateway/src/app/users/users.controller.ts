import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { UsersService } from './users.service';
import type { User as UserType } from '@prisma/client';

import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserSettingsDto } from './dtos/update-user-settings.dto';

import { Auth } from '../common/decorators/auth.decorator';
import { User } from '../common/decorators/user.decorator';
import { UsersInterceptor } from '../common/interceptors/users.interceptor';

@Controller('users')
@UseInterceptors(UsersInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  @Post(':username/follow')
  @Auth()
  async followUser(@User() user: UserType, @Param('username') username: string) {
    return this.userService.toggleFollowUser(user.id, username);
  }

  @Get(':username/following')
  async getUserFollowing(@Param('username') username: string) {
    return this.userService.getUserFollowing(username);
  }

  @Get(':username/followers')
  async getUserFollowers(@Param('username') username: string) {
    return this.userService.getUserFollowers(username);
  }

  @Delete()
  @Auth()
  async deleteUser(@User() user: UserType) {
    return this.userService.deleteUser(user.id);
  }

  @Patch()
  @Auth()
  updateUser(@User() user: UserType, @Body() data: UpdateUserDto) {
    return this.userService.updateUser(user.id, data);
  }

  @Patch('settings')
  @Auth()
  async updateUserSettings(
    @User() user: UserType,
    @Body() data: UpdateUserSettingsDto
  ) {
    return this.userService.updateUserSettings(user.id, data);
  }
}
