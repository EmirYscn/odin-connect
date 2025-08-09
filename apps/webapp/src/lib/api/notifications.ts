import { api } from './axios';
import { Notification } from '@odin-connect-monorepo/types';

export const getUnreadNotificationsCount = async (): Promise<number> => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get('/notifications');
  return response.data;
};
