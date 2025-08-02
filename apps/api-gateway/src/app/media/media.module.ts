import { Module } from '@nestjs/common';
import { MediaService } from './media.service';

import { MediaController } from './media.controller';
import { PrismaModule } from '@odin-connect-monorepo/prisma';
import { SupabaseModule } from '../supabase/supabase.module';
import { ProfileModule } from '../profile/profile.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, SupabaseModule, ProfileModule, UsersModule],
  providers: [MediaService],
  exports: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
