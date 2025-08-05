import { useQuery } from '@tanstack/react-query';

import { useEffect } from 'react';
import { getCurrentUser } from '../lib/api/auth';
// import { connectSocket } from '../lib/api/socket';
import { connectSocket } from '../contexts/SocketContext';

const USER_QUERY_KEY = 'user';

export const useUser = () => {
  const query = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.data) {
      connectSocket();
    }
  }, [query.data]);

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isAuthenticated: !!query.data,
  };
};
