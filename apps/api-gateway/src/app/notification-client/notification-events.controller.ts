import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventsGateway } from '../events/events.gateway'; // adjust path as needed
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationCreatedDto } from './dtos/notification-created.dto';

@Controller()
export class NotificationEventsController {
  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly notificationsService: NotificationsService
  ) {}

  @EventPattern('notification:created')
  async handleNotificationCreated(@Payload() data: NotificationCreatedDto) {
    // Fetch notification from DB
    const notification = await this.notificationsService.getNotificationById(
      data.notificationId
    );

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
