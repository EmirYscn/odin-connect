import { PipeTransform, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { UploadFilesMap } from '../types/upload-files.type';

@Injectable()
export class ImageCompressionPipe implements PipeTransform {
  async transform(files: UploadFilesMap) {
    if (!files) return files;

    if (files.avatar && files.avatar.length > 0) {
      files.avatar[0] = await this.compressImage(files.avatar[0], 'avatar');
    }

    if (files.backgroundImage && files.backgroundImage.length > 0) {
      files.backgroundImage[0] = await this.compressImage(
        files.backgroundImage[0],
        'backgroundImage'
      );
    }

    if (files.postMedia && files.postMedia.length > 0) {
      for (let i = 0; i < files.postMedia.length; i++) {
        files.postMedia[i] = await this.compressImage(
          files.postMedia[i],
          'postMedia'
        );
      }
    }

    return files;
  }

  async compressImage(
    file: Express.Multer.File,
    type: keyof UploadFilesMap
  ): Promise<Express.Multer.File> {
    if (file.mimetype === 'image/gif') {
      // Do not compress or process, just return the original file
      return file;
    }

    const resizeOptions: Partial<
      Record<keyof UploadFilesMap, { width: number; height: number }>
    > = {
      avatar: { width: 512, height: 512 },
      backgroundImage: { width: 1200, height: 400 },
    };

    let sharpInstance = sharp(file.buffer);

    if (resizeOptions[type]) {
      sharpInstance = sharpInstance.resize(
        resizeOptions[type].width,
        resizeOptions[type].height,
        { fit: 'cover' }
      );
    }

    type AllowedMimeTypes =
      | 'image/jpeg'
      | 'image/jpg'
      | 'image/png'
      | 'image/gif'
      | 'image/webp';

    const formatMap: Record<AllowedMimeTypes, (s: sharp.Sharp) => sharp.Sharp> =
      {
        'image/jpeg': (s: sharp.Sharp) => s.jpeg({ quality: 80 }),
        'image/jpg': (s: sharp.Sharp) => s.jpeg({ quality: 80 }),
        'image/png': (s: sharp.Sharp) => s.png({ quality: 80 }),
        'image/webp': (s: sharp.Sharp) => s.webp({ quality: 80 }),
        'image/gif': (s: sharp.Sharp) => s.gif(),
      };

    const formatFn =
      formatMap[file.mimetype as AllowedMimeTypes] || formatMap['image/jpeg'];
    const buffer = await formatFn(sharpInstance).toBuffer();
    file.buffer = buffer;
    file.mimetype = file.mimetype in formatMap ? file.mimetype : 'image/jpeg';

    return file;
  }
}
