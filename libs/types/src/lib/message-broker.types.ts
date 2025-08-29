// Defines the structure of events used in the message broker (RabbitMQ)
// // Post related events
export type PostLikedEventPayload = {
  actorId: string;
  postId: string;
};

export type PostRepostedEventPayload = {
  actorId: string;
  postId: string;
};

export type PostRepliedEventPayload = {
  actorId: string;
  postId: string;
  commentId: string;
};

// // User related events
export type UserFollowedEventPayload = {
  actorId: string;
  userId: string;
};

export type NotificationCreatedEventPayload = {
  notificationId: string;
};

// // Notification created event
export interface NotificationCreatedEvent {
  'notification:created': NotificationCreatedEventPayload;
}

export interface PostEvent {
  'post:liked': PostLikedEventPayload;
  'post:replied': PostRepliedEventPayload;
  'post:reposted': PostRepostedEventPayload;
}

export interface UserEvent {
  'user:followed': UserFollowedEventPayload;
}

// Defines the events that the Notification Service can consume and publish
export interface NotificationServiceConsumeEvent extends PostEvent, UserEvent {}
export type NotificationServicePublishEvent = NotificationCreatedEvent;

// Defines the events that the API Gateway can consume
export type ApiGatewayConsumeEvent = NotificationCreatedEvent;
export interface ApiGatewayPublishEvent extends PostEvent, UserEvent {}

// export interface NotificationEvent {
//   'post:liked': PostLikedEvent;
//   'post:replied': PostRepliedEvent;
//   'post:reposted': PostRepostedEvent;
//   'notification:created': NotificationCreatedEvent;
// }

// export type RabbitMQNotificationEvent = NotificationEvent;
