import { Injectable } from '@nestjs/common';
import { PrismaService } from '@odin-connect-monorepo/prisma';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}
}
