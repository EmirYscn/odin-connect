import { editProfile as editProfileApi } from '../lib/api/profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useUser } from './useUser';

import { Profile } from '@odin-connect-monorepo/types';
import { USER_QUERY_KEY } from '../lib/utils/queryKeys';

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  const { user } = useUser();
  const { mutate: editProfile, isPending } = useMutation({
    mutationFn: (
      profileData: Partial<
        Profile & { profileImageFile: File; backgroundImageFile: File }
      >
    ) => editProfileApi(profileData),
    onSuccess: () => {
      toast.success('Profile edited successfully!');
      queryClient.invalidateQueries({
        queryKey: ['profile', user?.profile?.id],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY],
        exact: false,
      });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { editProfile, isPending };
};
