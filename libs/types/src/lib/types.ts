export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';
export type NotificationType = 'LIKE' | 'REPLY' | 'FOLLOW' | 'REPOST';

type DateFields = {
  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
  readonly deletedAt?: Date | string | null;
};

export type Media = {
  id: string;
  url: string;
  filePath: string;
  type: MediaType;

  postId: string;
  post: Post;

  userId: string;
  user: User;
} & DateFields;

export type Like = {
  id: string;

  userId: string;
  user: User;

  postId?: string | null;
  post?: Post | null;
} & Pick<DateFields, 'createdAt'>;

export type Bookmark = {
  id: string;

  userId: string;
  user: User;

  postId?: string | null;
  post?: Post | null;
} & Pick<DateFields, 'createdAt'>;

export type Post = {
  id: string;
  content: string;

  published: boolean;

  userId: string;
  user: User;

  parentId?: string | null; // If this post is a reply to another post
  parent?: Post | null; // The parent post if this is a reply

  repostOfId?: string | null; // If this post is a repost of another post
  repostOf?: Post | null; // The original post if this is a repost

  medias: Media[];
  replies: Post[]; // Replies to this post
  likes: Like[];
  bookmarks: Bookmark[];
  reposts: Post[];

  _count?: {
    replies?: number;
    likes?: number;
    bookmarks?: number;
    reposts?: number;
  };

  isLikedByCurrentUser?: boolean; // Indicates if the current user has liked this post
  isBookmarkedByCurrentUser?: boolean; // Indicates if the current user has bookmarked this post
  isRepostedByCurrentUser?: boolean; // Indicates if the current user has reposted this post
} & DateFields;

export type Profile = {
  id: string;
  bio: string; // User's bio
  location: string; // User's location
  website: string; // User's personal website or blog

  userId: string;
  user: User;

  isFollowedByCurrentUser?: boolean; // Indicates if the current user follows this profile
  isCurrentUserFollowedByThisUser?: boolean; // Indicates if this profile follows the current user
} & DateFields;

export type Notification = {
  id: string;
  type: NotificationType; // Type of notification (like, comment, follow, repost)
  message: string; // Notification message
  read: boolean; // Whether the notification has been read

  actorId: string; // User who performed the action that triggered the notification
  actor: User; // User who performed the action

  userId: string; // User who receives the notification
  user: User;

  postId?: string | null; // Associated post if applicable
  post?: Post | null;
} & Pick<DateFields, 'createdAt'>;

export type User = {
  id: string;
  email: string;
  displayName?: string | null; // User's display name
  username: string;
  password?: string | null;
  avatar?: string | null; // Direct URL to avatar image
  backgroundImage?: string | null; // Direct URL to background image

  resetPasswordToken?: string | null;
  resetPasswordExpires?: string | null;

  posts: Post[];
  likes: Like[];
  bookmarks: Bookmark[];
  medias: Media[];
  profile?: Profile | null;

  following: UserFollowing[];
  followers: UserFollowing[];
  blockedUsers: UserBlocked[];
  blockedBy: UserBlocked[];

  userSettings?: UserSettings | null;

  _count?: {
    posts?: number;
    likes?: number;
    bookmarks?: number;
    reposts?: number;
    replies?: number;
    medias?: number;
    following?: number;
    followers?: number;
  };
} & DateFields;

export type UserFollowing = {
  id: string;
  followerId: string;
  followingId: string;

  follower: User;
  following: User;
} & Omit<DateFields, 'deletedAt'>;

export type UserBlocked = {
  id: string;
  userId: string;
  blockedUserId: string;

  user: User;
  blockedUser: User;
} & Omit<DateFields, 'deletedAt'>;

export type UserSettings = {
  id: string;
  notifications: boolean;

  userId: string;
  user: User;
} & Omit<DateFields, 'deletedAt'>;

export type FullPost = Post & {
  user: {
    id: string;
    username: string;
    displayName?: string | null;
    avatar?: string | null;
    profile?: { id: string } | null;
  };
  likes: Like[];
  reposts: Post[];
  bookmarks: Bookmark[];
  medias: Media[];
  _count?: {
    replies?: number;
    likes?: number;
    bookmarks?: number;
    reposts?: number;
  };
  parent?: FullPost | null; // If this post is a reply, include the parent post
  repostOf?: FullPost | null; // If this post is a repost, include the original post
};

export interface ServerToClientEvents {
  'message:received': (data: any) => void;
  'post:created': (data: FullPost) => void;
  'notification:received': (data: Partial<Notification>) => void;
  'post:liked': (data: { actorId: string; postId: string }) => void;
  'post:replied': (data: { actorId: string; postId: string }) => void;
  'post:reposted': (data: { actorId: string; postId: string }) => void;
  'post:bookmarked': (data: { actorId: string; postId: string }) => void;
}

export interface ClientToServerEvents {
  'message:send': (data: any) => void;
}
