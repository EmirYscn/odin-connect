import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  clientUrl: process.env.CLIENT_URL,
  serverUrl: process.env.SERVER_URL,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  uploadFileSizeLimit: parseInt(process.env.UPLOAD_FILE_SIZE_LIMIT!, 10),
}));
