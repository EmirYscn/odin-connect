import { HiOutlineInbox } from 'react-icons/hi2';
import MediasSkeleton from '../../../components/MediasSkeleton';
import { MediaWithSkeleton } from '../../../components/MediaWithSkeleton';
import { useProfileMedias } from '../../../hooks/useProfileMedias';

type MediasProps = {
  username: string;
};

function Medias({ username }: MediasProps) {
  const { medias, isLoading } = useProfileMedias(username as string);

  if (isLoading) return <MediasSkeleton />;

  return medias && medias.length > 0 ? (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {medias.map((media) => (
        <MediaWithSkeleton key={media.id} src={media.url} />
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-16 opacity-70">
      <HiOutlineInbox className="w-16 h-16 text-[var(--color-grey-600)] mb-4" />
      <h2 className="text-xl font-semibold text-[var(--color-grey-700)] mb-2">
        No media shared yet
      </h2>
      <p className="text-[var(--color-grey-600)] text-center max-w-xs">
        This user has not shared any media yet. Follow them to see their
        updates!
      </p>
    </div>
  );
}

export default Medias;
