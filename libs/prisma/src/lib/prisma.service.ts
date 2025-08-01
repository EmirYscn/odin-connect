import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect()
      .then(() => {
        console.log('Prisma connected successfully');
      })
      .catch((error: unknown) => {
        console.error('Prisma connection error:', error);
        process.exit(1); // Exit the process if Prisma fails to connect
      });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
