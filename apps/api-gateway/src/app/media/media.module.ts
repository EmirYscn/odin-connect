import { forwardRef, Module } from '@nestjs/common';
import { MediaService } from './media.service';

import { MediaController } from './media.controller';
import { PrismaModule } from '@odin-connect-monorepo/prisma';
import { SupabaseModule } from '../supabase/supabase.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, SupabaseModule, forwardRef(() => UsersModule)],
  providers: [MediaService],
  exports: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
