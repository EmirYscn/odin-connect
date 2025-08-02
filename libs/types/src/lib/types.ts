export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

type DateFields = {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly deletedAt?: string | null;
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

export type Repost = {
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

  medias: Media[];
  replies: Post[]; // Replies to this post
  likes: Like[];
  bookmarks: Bookmark[];
  reposts: Repost[];

  _count?: {
    replies?: number;
    likes?: number;
    bookmarks?: number;
    reposts?: number;
  };

  isLikedByCurrentUser?: boolean; // Indicates if the current user has liked this post
} & DateFields;

export type Profile = {
  id: string;
  bio: string; // User's bio
  location: string; // User's location
  website: string; // User's personal website or blog

  userId: string;
  user: User;
} & DateFields;

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
  reposts: Repost[];
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

export interface PostCreatedPayload {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatar?: string | null;
    profile: {
      id: string;
    } | null;
  };
  medias?: {
    id: string;
    url: string;
    filePath: string;
    type: MediaType;
  }[]; // Optional, if the post has media
  _count?: {
    replies?: number;
    likes?: number;
    bookmarks?: number;
    reposts?: number;
  };
}

export interface ServerToClientEvents {
  'message:received': (data: any) => void;
  'post:created': (data: PostCreatedPayload) => void;
}

export interface ClientToServerEvents {
  'message:send': (data: any) => void;
}
