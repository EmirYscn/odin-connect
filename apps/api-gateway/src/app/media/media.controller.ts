import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('profile/:profileId')
  getProfileMedias(@Param('profileId') profileId: string) {
    if (!profileId) {
      throw new BadRequestException('Profile ID is required');
    }
    return this.mediaService.getProfileMedias(profileId);
  }
}
