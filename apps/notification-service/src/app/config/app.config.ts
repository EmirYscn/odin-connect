import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV,
  rabbitMqUrl: process.env.RABBITMQ_URL,
}));
