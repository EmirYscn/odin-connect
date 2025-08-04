import { ClientProxy } from '@nestjs/microservices';

import { RabbitMQNotificationEvent } from '@odin-connect-monorepo/types';

export function emitMQEvent<K extends keyof RabbitMQNotificationEvent>(
  client: ClientProxy,
  key: K,
  payload: RabbitMQNotificationEvent[K]
) {
  client.emit<K, RabbitMQNotificationEvent[K]>(key, payload);
}
