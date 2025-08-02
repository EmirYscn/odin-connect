import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PrismaModule } from '@odin-connect-monorepo/prisma';

@Module({
  imports: [PrismaModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
