import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';
import { Prisma } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly supabaseService: SupabaseService
  ) {}

  async getProfileByUsername(username: string) {
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: user?.profile?.id },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatar: true,
            backgroundImage: true,
            followers: {
              select: { followerId: true },
            },
            following: {
              select: { followingId: true },
            },
            _count: {
              select: { posts: true, followers: true, following: true },
            },
          },
        },
      },
    });
    if (!profile) {
      throw new BadRequestException('Profile not found');
    }
    return profile;
  }

  async getProfileById(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            username: true,
            avatar: true,
            backgroundImage: true,
            followers: {
              select: { followerId: true },
            },
            following: {
              select: { followingId: true },
            },
            _count: {
              select: { posts: true, followers: true, following: true },
            },
          },
        },
      },
    });
    if (!profile) {
      throw new BadRequestException('Profile not found');
    }
    return profile;
  }

  async editProfile(
    id: string | undefined,
    profileData: Partial<Prisma.ProfileUpdateInput & Prisma.UserUpdateInput>,
    avatarFile?: Express.Multer.File,
    backgroundFile?: Express.Multer.File
  ) {
    if (!id) {
      throw new BadRequestException('Profile ID is required');
    }

    const existingProfile = await this.getProfileById(id);
    if (!existingProfile) {
      throw new BadRequestException('Profile not found');
    }

    // Ensure the user exists
    const user = await this.usersService.getUserById(existingProfile.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userFields = ['displayName', 'username', 'avatar', 'backgroundImage'];
    const userData: Record<string, any> = {};
    const profileFields: Record<string, any> = {};

    for (const [key, value] of Object.entries(profileData)) {
      if (userFields.includes(key)) {
        userData[key] = value;
      } else {
        profileFields[key] = value;
      }
    }

    if (userData.username) {
      const existingUsername = await this.usersService.getUserByUsername(
        userData.username as string
      );
      if (existingUsername && existingUsername.id !== user.id) {
        throw new BadRequestException('Username already exists');
      }
    }

    // Run updates in a transaction
    await this.prisma.$transaction(async (tx) => {
      if (Object.keys(userData).length > 0) {
        await tx.user.update({
          where: { id: user.id },
          data: userData,
        });
      }

      if (Object.keys(profileFields).length > 0) {
        await tx.profile.update({
          where: { id },
          data: profileFields,
        });
      }
    });

    // Only upload images after DB transaction succeeds
    let avatarUrl: string | undefined;
    if (avatarFile) {
      avatarUrl = await this.supabaseService.uploadAvatar(avatarFile, id);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { avatar: avatarUrl },
      });
    }

    let backgroundUrl: string | undefined;
    if (backgroundFile) {
      backgroundUrl = await this.supabaseService.uploadBackground(
        backgroundFile,
        id
      );

      await this.prisma.user.update({
        where: { id: user.id },
        data: { backgroundImage: backgroundUrl },
      });
    }

    return this.getProfileById(id);
  }
}
