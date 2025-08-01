import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import authConfig from '../config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly authService: AuthService
  ) {
    const { clientId, clientSecret, callbackUrl } = authConfiguration.google;

    if (!clientId || !clientSecret || !callbackUrl) {
      throw new Error(
        'Google OAuth configuration is not properly set in environment variables'
      );
    }
    super({
      clientID: authConfiguration.google.clientId as string,
      clientSecret: authConfiguration.google.clientSecret as string,
      callbackURL: authConfiguration.google.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.authService.validateOAuthUser(profile);
    return user || null;
  }
}
