import {
  BadRequestException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { HashingProvider } from '../auth/provider/hashing.provider';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider
  ) {}

  async createUser(data: Prisma.UserCreateInput, hasPassword = true) {
    const existingEmail = await this.getUserByEmail(data.email);
    if (existingEmail) {
      throw new HttpException('Email already exists', 400);
    }

    const existingUsername = await this.getUserByUsername(data.username);
    if (existingUsername) {
      throw new HttpException('Username already exists', 400);
    }

    const hashedPassword: string | null = hasPassword
      ? await this.hashingProvider.hashPassword(data.password as string)
      : null;

    return this.prisma.user.create({
      data: {
        ...data,
        displayName: data.username,
        password: hashedPassword,
        userSettings: { create: { notifications: true } },
        profile: { create: {} }, // Create an empty profile
      },
      include: {
        profile: { select: { id: true } },
        userSettings: true,
      },
    });
  }

  getUsers() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
    });
  }

  getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: { select: { id: true } },
      },
    });
  }

  getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: { select: { id: true } },
      },
    });
  }

  getUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        profile: { select: { id: true } },
      },
    });
  }

  getUserWithSettings(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        userSettings: true,
      },
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new HttpException('User not found', 404);
    }

    if (data.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: data.username as string },
      });

      if (existingUser) {
        throw new HttpException('Username already exists', 400);
      }
    }
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    const foundUser = await this.getUserById(id);
    if (!foundUser) {
      throw new HttpException('User not found', 404);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async updateUserSettings(
    userId: string,
    data: Prisma.UserSettingsUpdateInput
  ) {
    const foundUser = await this.getUserWithSettings(userId);
    if (!foundUser) {
      throw new HttpException('User not found', 404);
    }
    if (!foundUser.userSettings) {
      throw new BadRequestException('User settings not found');
    }
    return this.prisma.userSettings.update({
      where: { userId },
      data,
    });
  }

  async getUserFollowCounts(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return {
      following: user._count.following,
      followers: user._count.followers,
    };
  }

  async generateUniqueUsername(baseUsername: string): Promise<string> {
    const username =
      baseUsername.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';
    let uniqueUsername = username;
    let count = 0;

    while (await this.getUserByUsername(uniqueUsername)) {
      count++;
      uniqueUsername = `${username}${count > 1 ? count : ''}${nanoid(4)}`;
    }
    return uniqueUsername;
  }
}
