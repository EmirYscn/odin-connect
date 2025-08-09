import { useState } from 'react';
import Modal from './Modal';
import MediaPreviewModal from './MediaPreviewModal';

type MediaWithSkeletonProps = {
  src: string;
  variant?: 'profileImage' | 'postMedia';
};

export function MediaWithSkeleton({
  src,
  variant = 'postMedia',
}: MediaWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative w-full ${
        variant === 'profileImage' ? '' : 'aspect-video'
      }`}
    >
      {/* Skeleton or error placeholder */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-300 rounded-lg animate-pulse">
          {hasError ? (
            <span className="text-gray-500">Image failed to load</span>
          ) : null}
        </div>
      )}

      <Modal>
        <Modal.Open opens="preview">
          <div
            className={`relative w-full h-full cursor-pointer  ${
              variant === 'profileImage' ? '' : 'aspect-video'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt="Post media"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={` ${
                variant === 'profileImage' ? 'rounded-full' : 'rounded-lg'
              } h-full w-full object-cover transition-opacity duration-300 ${
                isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </Modal.Open>
        <Modal.Window
          name="preview"
          className="bg-transparent w-[100%] lg:w-[80%] xl:w-[70%] h-auto shadow-none"
        >
          <MediaPreviewModal previewUrl={src} />
        </Modal.Window>
      </Modal>
    </div>
  );
}
