import MediasSkeleton from '../../../components/MediasSkeleton';
import { MediaWithSkeleton } from '../../../components/MediaWithSkeleton';
import { useProfileMedias } from '../../../hooks/useProfileMedias';

type MediasProps = {
  profileId: string;
};

function Medias({ profileId }: MediasProps) {
  const { medias, isLoading } = useProfileMedias(profileId);

  if (isLoading) return <MediasSkeleton />;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {medias &&
        medias.map((media) => (
          <MediaWithSkeleton key={media.id} src={media.url} />
        ))}
    </div>
  );
}

export default Medias;
