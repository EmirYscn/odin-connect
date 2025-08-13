import axios from 'axios';
import { api } from './axios';
import { Post } from '@odin-connect-monorepo/types';

export const getForYouPosts = async (): Promise<Post[]> => {
  const response = await api.get('/posts/foryou');
  return response.data;
};

export const getFollowingPosts = async (): Promise<Post[]> => {
  const response = await api.get('/posts/following');
  return response.data;
};

export const getProfilePosts = async (profileId: string): Promise<Post[]> => {
  const response = await api.get(`/posts/profile/${profileId}`);
  return response.data;
};

export const getPost = async (id: string): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const getReplies = async (postId: string): Promise<Post[]> => {
  const response = await api.get(`/posts/${postId}/replies`);
  return response.data;
};

export const getProfileReplies = async (profileId: string): Promise<Post[]> => {
  const response = await api.get(`/posts/profile/${profileId}/replies`);
  return response.data;
};

export type PostPayload = {
  content?: string;
  parentId?: string | null; // For replies, can be null if not replying to a post
  imageFiles?: File[];
};

export const createPost = async (body: PostPayload): Promise<Post> => {
  try {
    const formData = new FormData();
    formData.append('content', body.content || '');
    if (body.parentId) {
      formData.append('parentId', body.parentId);
    }
    if (body.imageFiles) {
      body.imageFiles.forEach((file) => {
        formData.append('postMedia', file);
      });
    }

    const response = await api.post('/posts', formData);
    return response.data.post;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't create post";
      throw new Error(serverMessage);
    }

    throw new Error('An unexpected error occurred.');
  }
};

export const deletePost = async (id: string): Promise<void> => {
  try {
    await api.delete(`/posts/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't delete post";
      throw new Error(serverMessage);
    }

    throw new Error('An unexpected error occurred.');
  }
};

export const repostPost = async (postId: string) => {
  try {
    await api.post(`/posts/${postId}/repost`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't repost post";
      throw new Error(serverMessage);
    }

    throw new Error('An unexpected error occurred.');
  }
};
