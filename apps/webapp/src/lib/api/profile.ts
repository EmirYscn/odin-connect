import type { Profile } from '@odin-connect-monorepo/types';
import { api } from './axios';
import axios from 'axios';

export const getProfile = async (id: string): Promise<Profile> => {
  try {
    const res = await api.get(`/profile/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't fetch profile";
      throw new Error(serverMessage);
    }

    throw new Error('An unexpected error occurred.');
  }
};

export const editProfile = async (
  profileData: Partial<
    Profile & { profileImageFile: File; backgroundImageFile: File }
  >
): Promise<Profile> => {
  try {
    const formData = new FormData();
    // Append each field to the FormData object
    for (const [key, value] of Object.entries(profileData)) {
      if (
        value !== undefined &&
        key !== 'profileImageFile' &&
        key !== 'backgroundImageFile'
      ) {
        formData.append(key, value as string | Blob);
      }
    }
    // If imageFile is provided, append it as well
    if (profileData.profileImageFile instanceof File) {
      formData.append('avatar', profileData.profileImageFile);
    }
    // If backgroundImageFile is provided, append it as well
    if (profileData.backgroundImageFile instanceof File) {
      formData.append('backgroundImage', profileData.backgroundImageFile);
    }
    // Send the FormData object in the request
    const res = await api.patch('profile', formData);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message || "Couldn't update profile";
      throw new Error(serverMessage);
    }

    throw new Error('An unexpected error occurred.');
  }
};
