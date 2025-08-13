import { useQuery } from '@tanstack/react-query';

import { useEffect } from 'react';
import { getCurrentUser } from '../lib/api/auth';

import { connectSocket } from '../contexts/SocketContext';
import { USER_QUERY_KEY } from '../lib/utils/queryKeys';

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
