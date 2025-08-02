import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import { UploadFilesMap } from '../types/upload-files.type';

const exceptionMessage = {
  avatar: 'You can only upload one profile picture.',
  backgroundImage: 'You can only upload one background image.',
  postMedia: 'You can upload up to 4 media files for your post.',
};

const maxCounts: Record<keyof UploadFilesMap, number> = {
  avatar: 1,
  backgroundImage: 1,
  postMedia: 4,
};

@Injectable()
export class FileCountValidationPipe implements PipeTransform {
  transform(files: UploadFilesMap) {
    for (const [field, fileArr] of Object.entries(files)) {
      if (
        Array.isArray(fileArr) &&
        fileArr.length > maxCounts[field as keyof UploadFilesMap]
      ) {
        throw new BadRequestException(
          `${exceptionMessage[field as keyof UploadFilesMap]}`
        );
      }
    }
    return files;
  }
}
