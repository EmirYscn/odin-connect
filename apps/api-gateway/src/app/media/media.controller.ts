import { BadRequestException, Controller, Get, Param } from '@nestjs/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('profile/:username')
  getProfileMedias(@Param('username') username: string) {
    if (!username) {
      throw new BadRequestException('Username is required');
    }
    return this.mediaService.getProfileMedias(username);
  }
}
