import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  PORT: Joi.number().port().default(3000),

  DATABASE_URL: Joi.string().required(),
  CLIENT_URL: Joi.string().uri().required(),
  SERVER_URL: Joi.string().uri().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRESIN: Joi.number().required().default(3600), // 1 hour
  JWT_AUDIENCE: Joi.string().required(),
  JWT_ISSUER: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRESIN: Joi.number().required().default(604800), // 7 days

  SERVER_JWT_SECRET: Joi.string().required(),
  SERVER_JWT_EXPIRESIN: Joi.number().required().default(3600), // 1 hour

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().uri().required(),

  GITHUB_CLIENT_ID: Joi.string().required(),
  GITHUB_CLIENT_SECRET: Joi.string().required(),
  GITHUB_CALLBACK_URL: Joi.string().uri().required(),

  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_KEY: Joi.string().required(),

  UPLOAD_FILE_SIZE_LIMIT: Joi.number().default(1), // Default to 1 MB

  RABBITMQ_URL: Joi.string().required(),
});
