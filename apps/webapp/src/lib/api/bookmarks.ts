import { Bookmark } from '@odin-connect-monorepo/types';
import { api } from './axios';
import axios from 'axios';

export const getBookmarks = async (
  cursor?: string | null | undefined
): Promise<{ bookmarks: Bookmark[]; nextCursor: string }> => {
  const response = await api.get('/bookmarks', {
    params: cursor ? { cursor } : {},
  });

  console.log(response.data);

  return {
    bookmarks: response.data.bookmarks,
    nextCursor: response.data.nextCursor,
  };
};

export const bookmarkPost = async (postId: string) => {
  try {
    await api.post('/bookmarks', { postId });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't bookmark post";
      throw new Error(serverMessage);
    }

    throw new Error('An unexpected error occurred.');
  }
};
