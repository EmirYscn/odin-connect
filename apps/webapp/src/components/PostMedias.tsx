import { Media } from '@odin-connect-monorepo/types';
import { MediaWithSkeleton } from './MediaWithSkeleton';

type PostMediasProps = {
  medias: Media[];
};
function PostMedias({ medias }: PostMediasProps) {
  return (
    medias.length > 0 && (
      <div
        className={`grid gap-2 ${
          medias?.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
        }`}
      >
        {medias.map((media) => (
          <MediaWithSkeleton key={media.id} src={media.url} />
        ))}
      </div>
    )
  );
}

export default PostMedias;
