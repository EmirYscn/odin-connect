import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: parseInt(process.env.JWT_EXPIRESIN!, 10),
  refreshTokenExpiresIn: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRESIN!, 10),
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: process.env.GITHUB_CALLBACK_URL,
  },
  server: {
    secret: process.env.SERVER_JWT_SECRET,
    expiresIn: parseInt(process.env.SERVER_JWT_EXPIRESIN!, 10),
  },
}));
