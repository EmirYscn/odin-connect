import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { signup as signupApi } from '../lib/api/auth';
import { useNavigate } from 'react-router-dom';

export const useSignup = () => {
  const navigate = useNavigate();

  const { mutate: signup, isPending } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      navigate('/login', { replace: true });
      toast.success('Account successfully created!');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { signup, isPending };
};

export default useSignup;
