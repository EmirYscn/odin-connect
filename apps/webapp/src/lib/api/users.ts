import axios from 'axios';
import { api } from './axios';
import { User } from '@odin-connect-monorepo/types';

export const getUsers = async () => {
  try {
    const res = await api.get('/users');
    return res.data;
  } catch {
    throw new Error('Failed to fetch users');
  }
};

export const followUser = async (username: string) => {
  try {
    await api.post(`/users/${username}/follow`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't follow user";
      throw new Error(serverMessage);
    }

    throw new Error('An unexpected error occurred.');
  }
};

export const getUserFollowing = async (userId: string): Promise<User[]> => {
  try {
    const res = await api.get(`/users/${userId}/following`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't fetch following";
      throw new Error(serverMessage);
    }

    throw new Error('An unexpected error occurred.');
  }
};

export const getUserFollowers = async (userId: string): Promise<User[]> => {
  try {
    const res = await api.get(`/users/${userId}/followers`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't fetch followers";
      throw new Error(serverMessage);
    }

    throw new Error('An unexpected error occurred.');
  }
};
