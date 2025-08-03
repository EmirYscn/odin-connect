import { login as loginApi } from '../lib/api/auth';
import { USER_QUERY_KEY } from '../lib/utils/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => loginApi(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData([USER_QUERY_KEY], user);
      navigate('/home', { replace: true });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return { login, isPending };
};
