import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

export function Auth() {
  return applyDecorators(UseGuards(JwtAuthGuard));
}
