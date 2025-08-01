import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import type { Request, Response } from 'express';
import type { User as UserType } from '@prisma/client';
import type { ConfigType } from '@nestjs/config';

import { RefreshTokenDto } from './dtos/refresh-token.dto';

import { GoogleAuthGuard } from './guards/google.guard';
import { GithubAuthGuard } from './guards/github.guard';
import appConfig from '../config/app.config';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { Auth } from '../decorators/auth.decorator';
import { User } from '../decorators/user.decorator';
import { UsersInterceptor } from '../interceptors/users.interceptor';
import type { UserWithProfile } from './types/prismaTypes';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalGuard)
  async login(@Req() req: Request) {
    const user = req.user as UserType;
    const {
      accessToken,
      refreshToken,
      user: userData,
    } = await this.authService.login(user);
    return { userData, accessToken, refreshToken };
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signup(createUserDto);
  }

  @Get('status')
  @Auth()
  @UseInterceptors(UsersInterceptor)
  status(@User() user: UserType) {
    return { user };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLoginWithGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async handleGoogleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserType;

    const {
      accessToken,
      refreshToken,
      user: userData,
    } = await this.authService.login(user);

    const payload = Buffer.from(
      JSON.stringify({
        status: 'success',
        provider: 'Google',
        user: userData,
        accessToken,
        refreshToken,
      })
    ).toString('base64');
    // Redirect to frontend with token
    const CLIENT_URL = this.appConfiguration.clientUrl;
    return res.redirect(`${CLIENT_URL}/auth?data=${payload}`);
  }

  @Get('github/login')
  @UseGuards(GithubAuthGuard)
  handleLoginWithGithub() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async handleGithubCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserType;

    const {
      accessToken,
      refreshToken,
      user: userData,
    } = await this.authService.login(user);

    const payload = Buffer.from(
      JSON.stringify({
        status: 'success',
        provider: 'Github',
        user: userData,
        accessToken,
        refreshToken,
      })
    ).toString('base64');
    // Redirect to frontend with token
    const CLIENT_URL = this.appConfiguration.clientUrl;
    return res.redirect(`${CLIENT_URL}/auth?data=${payload}`);
  }

  @Get('server-token')
  @Auth()
  getServerToken(@User() user: UserWithProfile) {
    const token = this.authService.getServerToken(user);
    return { token };
  }
}
