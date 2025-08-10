import { api } from './axios';
import { Notification } from '@odin-connect-monorepo/types';

export const getUnreadNotificationsCount = async (): Promise<number> => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

export const getNotifications = async (
  cursor?: string | null | undefined
): Promise<{ notifications: Notification[]; nextCursor: string }> => {
  const response = await api.get('/notifications', {
    params: cursor ? { cursor } : {},
  });

  return {
    notifications: response.data.notifications,
    nextCursor: response.data.nextCursor,
  };
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.post('/notifications/mark-all-as-read');
};
