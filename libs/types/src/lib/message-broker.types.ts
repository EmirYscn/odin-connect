export type PostLikedEvent = {
  actorId: string;
  postId: string;
};

export type PostRepostedEvent = {
  actorId: string;
  postId: string;
};

export type PostCommentedEvent = {
  actorId: string;
  postId: string;
  commentId: string;
};

export interface NotificationEvent {
  'post:liked': PostLikedEvent;
  'post:reposted': PostLikedEvent;
  'post:commented': PostLikedEvent;
}

export type RabbitMQNotificationEvent = NotificationEvent;
