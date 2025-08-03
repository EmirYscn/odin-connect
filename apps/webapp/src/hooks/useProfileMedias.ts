import { getProfileMedias } from '../lib/api/media';
import { useQuery } from '@tanstack/react-query';

export const useProfileMedias = (profileId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['medias', 'profile', profileId],
    queryFn: async () => getProfileMedias(profileId),
    enabled: !!profileId,
  });

  return {
    medias: data,
    isLoading,
  };
};
