import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { randomUUID } from 'crypto';

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MediaType } from '@odin-connect-monorepo/types';

import appConfig from '../config/app.config';

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient;
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {
    this.supabase = createClient(
      this.appConfiguration.supabaseUrl!,
      this.appConfiguration.supabaseKey!
    );
  }

  async uploadAvatar(file: Express.Multer.File, userId: string) {
    const { buffer } = file;

    const timestamp = Date.now();
    const folderPath = `user-${userId}`;
    const ext = file.mimetype.split('/')[1];

    const filePath = `${folderPath}/avatar-${timestamp}.${ext}`;

    try {
      // Delete existing file first (if it exists)
      const { data: files, error: listError } = await this.supabase.storage
        .from('avatars')
        .list(folderPath);

      if (listError) {
        throw listError;
      }

      if (files && files.length > 0) {
        const filePaths = files.map((file) => `${folderPath}/${file.name}`);
        await this.supabase.storage.from('avatars').remove(filePaths);
      }

      const { error } = await this.supabase.storage
        .from('avatars')
        .upload(filePath, buffer, {
          contentType: file.mimetype,
          //   upsert: true, // Overwrite existing file
        });

      if (error) {
        throw new Error(`Failed to upload avatar: ${error.message}`);
      }

      const { data } = this.supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Could not generate public URL');
      }

      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
      return publicUrl;
    } catch {
      throw new Error(`Failed to upload avatar`);
    }
  }

  async uploadBackground(file: Express.Multer.File, userId: string) {
    const { buffer, mimetype } = file;

    const timestamp = Date.now();
    const folderPath = `user-${userId}`;

    const ext = mimetype.split('/')[1];

    const filePath = `${folderPath}/background-${timestamp}.${ext}`;

    try {
      // Delete existing file first (if it exists)
      const { data: files, error: listError } = await this.supabase.storage
        .from('backgrounds')
        .list(folderPath);

      if (listError) {
        throw listError;
      }

      if (files && files.length > 0) {
        const filePaths = files.map((file) => `${folderPath}/${file.name}`);
        await this.supabase.storage.from('backgrounds').remove(filePaths);
      }

      const { error } = await this.supabase.storage
        .from('backgrounds')
        .upload(filePath, buffer, {
          contentType: mimetype,
          //   upsert: true, // Overwrite existing file
        });

      if (error) {
        throw new Error(`Failed to upload background: ${error.message}`);
      }

      const { data } = this.supabase.storage
        .from('backgrounds')
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Could not generate public URL');
      }

      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
      return publicUrl;
    } catch {
      throw new Error(`Failed to upload background`);
    }
  }

  async uploadMedia(
    file: Express.Multer.File,
    userId: string,
    postId: string
  ): Promise<{ publicUrl: string; filePath: string }> {
    const { buffer, mimetype } = file;

    const ext = mimetype.split('/')[1];
    const timestamp = Date.now();
    const uniqueId = randomUUID();
    const mediaType = mimetype.split('/')[0] as MediaType;

    const folderName = `user-${userId}`;
    const fileName = `${postId}-${timestamp}-${uniqueId}.${ext}`;
    const filePath = `${folderName}/${mediaType}/${fileName}`;

    try {
      const { error } = await this.supabase.storage
        .from('medias')
        .upload(filePath, buffer, {
          contentType: mimetype,
        });

      if (error) {
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      const { data } = this.supabase.storage
        .from('medias')
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Could not generate public URL');
      }

      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      return { publicUrl, filePath };
    } catch {
      throw new Error(`Failed to upload file`);
    }
  }

  async deleteMediaFiles(filePaths: string[]) {
    const results = await Promise.all(
      filePaths.map((filePath) =>
        this.supabase.storage.from('medias').remove([filePath])
      )
    );

    // Collect errors
    const errors = results
      .map((result, idx) =>
        result.error ? { filePath: filePaths[idx], error: result.error } : null
      )
      .filter(Boolean);

    if (errors.length > 0) {
      // You can throw, return, or log the errors as needed
      throw new InternalServerErrorException(
        `Failed to delete media files from storage`
      );
    }
  }
}
