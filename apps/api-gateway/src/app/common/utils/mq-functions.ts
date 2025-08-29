import { ClientProxy } from '@nestjs/microservices';
import { ApiGatewayPublishEvent } from '@odin-connect-monorepo/types';

export function emitMQEvent<K extends keyof ApiGatewayPublishEvent>(
  client: ClientProxy,
  key: K,
  payload: ApiGatewayPublishEvent[K]
) {
  client.emit<K, ApiGatewayPublishEvent[K]>(key, payload);
}
