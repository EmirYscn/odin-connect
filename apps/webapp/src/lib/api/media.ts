import { Media } from '@odin-connect-monorepo/types';
import { api } from './axios';

export const getProfileMedias = async (profileId: string): Promise<Media[]> => {
  const response = await api.get(`/media/profile/${profileId}`);
  return response.data;
};
