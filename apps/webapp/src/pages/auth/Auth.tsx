import { useQueryClient } from '@tanstack/react-query';

import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { USER_QUERY_KEY } from '../../lib/utils/constants';
import { connectSocket } from '../../contexts/SocketContext';
import Spinner from '../../components/Spinner';
// import { connectSocket } from '../../lib/api/socket';

function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return; // Prevent running twice
    effectRan.current = true;
    const encodedData = searchParams.get('data');
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData));
        const { status, provider, user, accessToken, refreshToken } =
          decodedData;

        queryClient.setQueryData([USER_QUERY_KEY], user);

        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        connectSocket();
        // connectSocket();

        toast.success(
          `Successfully logged in ${provider ? `with ${provider}` : ''}`
        );
        setTimeout(() => {
          navigate('/home');
        }, 300);
      } catch {
        toast.error('Authentication failed');
        navigate('/login', { replace: true });
      }
    }
  }, [navigate, searchParams, queryClient]);

  return <Spinner />;
}

export default Auth;
