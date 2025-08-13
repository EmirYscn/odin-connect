import axios from 'axios';
import { api } from './axios';

export const likePost = async (postId: string) => {
  try {
    await api.post('/likes', { postId });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't like post";
      throw new Error(serverMessage);
    }

    throw new Error('An unexpected error occurred.');
  }
};
