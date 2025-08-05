import { IsString } from 'class-validator';

export class NotificationCreatedDto {
  @IsString()
  notificationId!: string;
}
