import { Media } from '@odin-connect-monorepo/types';
import { api } from './axios';

export const getProfileMedias = async (username: string): Promise<Media[]> => {
  const response = await api.get(`/media/profile/${username}`);
  return response.data;
};
