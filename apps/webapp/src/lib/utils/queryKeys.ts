// user query key
export const USER_QUERY_KEY = 'user';

// post query key
export const POST_QUERY_KEY = 'posts';

// posts query keys
export const POSTS_FEED_FORYOU = [POST_QUERY_KEY, 'feed', 'foryou'];
export const POSTS_FEED_FOLLOWING = [POST_QUERY_KEY, 'feed', 'following'];

export const POST = (postId: string) => ['post', postId];
export const POST_REPLIES = (postId: string) => ['post', 'replies', postId];
export const POSTS_PROFILE = (profileId: string) => [
  'posts',
  'profile',
  profileId,
];

// notification query keys
export const NOTIFICATIONS = ['notifications'];
export const NOTIFICATIONS_UNREAD_COUNT = ['notifications', 'unreadCount'];

// bookmark query key
export const BOOKMARKS = ['bookmarks'];
