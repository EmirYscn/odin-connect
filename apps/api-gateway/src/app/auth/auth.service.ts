import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { HashingProvider } from './provider/hashing.provider';
import authConfig from './config/auth.config';
import type { ConfigType } from '@nestjs/config';

import { RefreshTokenDto } from './dtos/refresh-token.dto';

import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Profile as GithubProfile } from 'passport-github2';

import * as jwt from 'jsonwebtoken';

import { UsersService } from '../users/users.service';
import { UserWithProfile } from '../common/types/prismaTypes';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { JwtObject } from '../common/types/jwt';
import { ActiveUserType } from './interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingProvider: HashingProvider,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>
  ) {}

  async validateUser(loginDto: LoginDto) {
    const { email, password: pass } = loginDto;

    const existingUser = await this.usersService.getUserByEmail(email);

    if (!existingUser || !existingUser.password)
      throw new UnauthorizedException('Invalid credentials');

    const isMatch = await this.hashingProvider.comparePasswords(
      pass,
      existingUser.password
    );
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...userWithoutPassword } = existingUser;
    return userWithoutPassword;
  }

  async validateOAuthUser(details: GoogleProfile | GithubProfile) {
    const email = details.emails?.[0].value as string;
    const existingUser = await this.usersService.getUserByEmail(email);
    if (existingUser) {
      const { password: _, ...userWithoutPassword } = existingUser;
      return userWithoutPassword;
    }

    const baseUsername =
      details.username ||
      details.displayName?.split(' ').join('').toLowerCase() ||
      email.split('@')[0];

    const username = await this.usersService.generateUniqueUsername(
      baseUsername
    );

    const newUserData = {
      email,
      displayName: details.displayName,
      username: username,
      avatar: details.photos?.[0]?.value,
    };
    const newUser = await this.usersService.createUser(newUserData, false);
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  getServerToken(user: UserWithProfile) {
    const token = this.signServerToken(user.id, {
      userId: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName as string,
      profileId: user.profile?.id,
      avatar: user.avatar,
    });
    return token;
  }

  async login(user: User) {
    const { accessToken, refreshToken } = await this.generateToken(user);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  public async signup(createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<JwtObject>(
        refreshTokenDto.refreshToken
      );
      const user = await this.usersService.getUserById(sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return await this.generateToken(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private signServerToken<T>(userId: string, payload?: T) {
    return jwt.sign(
      {
        sub: userId,
        ...payload,
      },
      this.authConfiguration.server.secret as string,
      {
        expiresIn: this.authConfiguration.server.expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      }
    );
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.authConfiguration.secret,
        expiresIn: expiresIn,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      }
    );
  }

  private async generateToken(user: User) {
    const accessToken = await this.signToken<Partial<ActiveUserType>>(
      user.id,
      this.authConfiguration.expiresIn,
      {
        email: user.email,
        username: user.username,
      }
    );
    const refreshToken = await this.signToken(
      user.id,
      this.authConfiguration.refreshTokenExpiresIn
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
