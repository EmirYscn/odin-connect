import { getProfileMedias } from '../lib/api/media';
import { useQuery } from '@tanstack/react-query';
import { PROFILE_MEDIAS } from '../lib/utils/queryKeys';

export const useProfileMedias = (username: string) => {
  const { data, isLoading } = useQuery({
    queryKey: PROFILE_MEDIAS(username),
    queryFn: async () => getProfileMedias(username),
    enabled: !!username,
  });

  return {
    medias: data,
    isLoading,
  };
};
