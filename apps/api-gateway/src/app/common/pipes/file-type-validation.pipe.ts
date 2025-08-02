import { BadRequestException, PipeTransform } from '@nestjs/common';
import { UploadFilesMap } from '../types/upload-files.type';

const exceptionMessage: Record<keyof UploadFilesMap, string> = {
  avatar:
    'Please upload a valid image file for your profile picture (jpg, jpeg, png, gif, webp).',
  backgroundImage:
    'Please upload a valid image file for your background (jpg, jpeg, png, gif, webp).',
  postMedia:
    'Please upload a valid image file for your post (jpg, jpeg, png, gif, webp).',
};

export class FileTypeValidationPipe implements PipeTransform {
  transform(values: UploadFilesMap) {
    const allowedMimeTypes = [
      'image/jpg',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    for (const [field, files] of Object.entries(values)) {
      if (Array.isArray(files) && files.length > 0) {
        for (const file of files) {
          if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException(
              `${exceptionMessage[field as keyof UploadFilesMap]}`
            );
          }
        }
      }
    }
    return values;
  }
}
