import { ClientProxy } from '@nestjs/microservices';
import { NotificationServicePublishEvent } from '@odin-connect-monorepo/types';

export function emitMQEvent<K extends keyof NotificationServicePublishEvent>(
  client: ClientProxy,
  key: K,
  payload: NotificationServicePublishEvent[K]
) {
  client.emit<K, NotificationServicePublishEvent[K]>(key, payload);
}
