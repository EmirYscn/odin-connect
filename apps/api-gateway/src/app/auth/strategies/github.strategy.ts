import { Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import authConfig from '../config/auth.config';
import type { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Profile, Strategy } from 'passport-github2';

export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    authConfiguration: ConfigType<typeof authConfig>,
    private readonly authService: AuthService
  ) {
    const { clientId, clientSecret, callbackUrl } = authConfiguration.github;

    if (!clientId || !clientSecret || !callbackUrl) {
      throw new Error(
        'Github OAuth configuration is not properly set in environment variables'
      );
    }
    super({
      clientID: clientId as string,
      clientSecret: clientSecret as string,
      callbackURL: callbackUrl as string,
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.authService.validateOAuthUser(profile);
    return user || null;
  }
}
