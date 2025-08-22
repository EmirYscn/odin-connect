import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { User as UserType } from '@prisma/client';

import { UpdateProfileDto } from './dtos/update-profile.dto';

import { UsersService } from '../users/users.service';
import { ProfileService } from './profile.service';

import { Auth } from '../common/decorators/auth.decorator';
import { User } from '../common/decorators/user.decorator';
import type { UploadFilesMap } from '../common/types/upload-files.type';

import { FileTypeValidationPipe } from '../common/pipes/file-type-validation.pipe';
import { FileSizeValidationPipe } from '../common/pipes/file-size-validation.pipe';
import { ImageCompressionPipe } from '../common/pipes/image-compression.pipe';
import { IsFollowedByCurrentUserInterceptor } from './interceptors/isFollowedByCurrentUser.interceptor';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService
  ) {}

  @Get(':username')
  @Auth()
  @UseInterceptors(IsFollowedByCurrentUserInterceptor)
  getProfileByUsername(@Param('username') username: string) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }
    return this.profileService.getProfileByUsername(username);
  }

  @Patch()
  @Auth()
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'avatar',
        maxCount: 1,
      },
      {
        name: 'backgroundImage',
        maxCount: 1,
      },
    ])
  )
  async editProfile(
    @User() currentUser: UserType,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFiles(
      FileTypeValidationPipe,
      FileSizeValidationPipe,
      ImageCompressionPipe
    )
    files: UploadFilesMap
  ) {
    const user = await this.usersService.getUserById(currentUser.id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const profileId = user.profile?.id;

    const { avatar, backgroundImage } = files;

    return this.profileService.editProfile(
      profileId,
      updateProfileDto,
      avatar?.[0],
      backgroundImage?.[0]
    );
  }
}
