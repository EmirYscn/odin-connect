import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventsGateway } from '../events/events.gateway'; // adjust path as needed
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationCreatedDto } from './dtos/notification-created.dto';
import { ApiGatewayConsumeEvent } from '@odin-connect-monorepo/types';

@Controller()
export class NotificationEventsController {
  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly notificationsService: NotificationsService
  ) {}

  @EventPattern<keyof ApiGatewayConsumeEvent>('notification:created')
  async handleNotificationCreated(@Payload() data: NotificationCreatedDto) {
    // Fetch notification from DB
    const notification = await this.notificationsService.getNotificationById(
      data.notificationId
    );

    if (!notification) {
      console.error(
        `[Notification-Service]: Notification with ID ${data.notificationId} not found.`
      );
      return;
    }

    // Emit to client via EventsGateway
    if (notification) {
      this.eventsGateway.broadcastToUser(
        'notification:received',
        notification.userId,
        notification
      );
    }
  }
}
