import { editProfile as editProfileApi } from '../lib/api/profile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Profile } from '@odin-connect-monorepo/types';
import { PROFILE, USER_QUERY_KEY } from '../lib/utils/queryKeys';
import { useNavigate, useParams } from 'react-router-dom';

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  const { username } = useParams();
  const navigate = useNavigate();

  const { mutate: editProfile, isPending } = useMutation({
    mutationFn: (
      profileData: Partial<
        Profile & { profileImageFile: File; backgroundImageFile: File }
      >
    ) => editProfileApi(profileData),
    onSuccess: (data) => {
      toast.success('Profile edited successfully!');
      queryClient.invalidateQueries({
        queryKey: PROFILE(username || ''),
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: [USER_QUERY_KEY],
        exact: false,
      });
      // Redirect if username changed
      if (data?.user.username && data.user.username !== username) {
        navigate(`/profile/${data.user.username}`);
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { editProfile, isPending };
};
