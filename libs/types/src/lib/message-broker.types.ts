export type PostLikedEvent = {
  actorId: string;
  postId: string;
};

export type PostRepostedEvent = {
  actorId: string;
  postId: string;
};

export type PostRepliedEvent = {
  actorId: string;
  postId: string;
  commentId: string;
};

export type NotificationCreatedEvent = {
  notificationId: string;
};

export interface NotificationEvent {
  'post:liked': PostLikedEvent;
  'post:replied': PostRepliedEvent;
  'post:reposted': PostRepostedEvent;
  'notification:created': NotificationCreatedEvent;
}

export type RabbitMQNotificationEvent = NotificationEvent;
