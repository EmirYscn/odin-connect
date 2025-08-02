import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { UploadFilesMap } from '../types/upload-files.type';
import appConfig from '../../config/app.config';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  private uploadFileSizeLimit: number;
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {
    this.uploadFileSizeLimit =
      this.appConfiguration.uploadFileSizeLimit * 1024 * 1024; // Convert MB to bytes
  }
  transform(values: UploadFilesMap) {
    const { avatar, backgroundImage, postMedia } = values;
    if (avatar && avatar.length > 0) {
      this.validateFileSize(avatar[0], 'Avatar');
    }
    if (backgroundImage && backgroundImage.length > 0) {
      this.validateFileSize(backgroundImage[0], 'Background Image');
    }

    if (postMedia && postMedia.length > 0) {
      postMedia.forEach((file, index) => {
        this.validateFileSize(file, `Post Media ${index + 1}`);
      });
    }

    return values;
  }

  validateFileSize(file: Express.Multer.File, field = 'File') {
    const limit = this.uploadFileSizeLimit;

    if (file.size > limit) {
      throw new BadRequestException(
        `${field} size exceeds ${limit / (1024 * 1024)}MB`
      );
    }
  }
}
