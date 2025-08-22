import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';
import { Media, MEDIA_TYPE } from '@prisma/client';
import { SupabaseService } from '../supabase/supabase.service';
import { ProfileService } from '../profile/profile.service';
import { UsersService } from '../users/users.service';

const mediaMapping: Record<string, MEDIA_TYPE> = {
  image: MEDIA_TYPE.IMAGE,
  video: MEDIA_TYPE.VIDEO,
  audio: MEDIA_TYPE.AUDIO,
};

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly profileService: ProfileService,
    private readonly usersService: UsersService
  ) {}

  async createPostMedia(
    postId: string,
    userId: string,
    postMedias: Express.Multer.File[]
  ) {
    const mediaUrls = await Promise.all(
      postMedias.map((media) =>
        this.supabaseService.uploadMedia(media, userId, postId)
      )
    );

    // Prepare all create operations
    const createOps = postMedias.map((media, index) =>
      this.prisma.media.create({
        data: {
          postId,
          userId,
          url: mediaUrls[index].publicUrl,
          filePath: mediaUrls[index].filePath,
          type: mediaMapping[media.mimetype.split('/')[0]] as MEDIA_TYPE,
        },
      })
    );

    // Run all creates in a transaction
    await this.prisma.$transaction(createOps);
  }

  async deletePostMedias(medias: Partial<Media>[]) {
    const filePaths = medias.map((media) => media.filePath);
    if (filePaths.length === 0) {
      return;
    }

    await this.supabaseService.deleteMediaFiles(filePaths as string[]);

    try {
      await this.prisma.media.deleteMany({
        where: {
          id: { in: medias.map((media) => media.id!) },
        },
      });
    } catch {
      throw new InternalServerErrorException(
        `Failed to delete media records from database`
      );
    }
  }

  async getProfileMedias(username: string): Promise<Media[]> {
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const medias = await this.prisma.media.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return medias;
  }
}
