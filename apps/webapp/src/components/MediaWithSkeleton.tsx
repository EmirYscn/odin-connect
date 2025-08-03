import { useState } from 'react';
import Modal from './Modal';
import MediaPreviewModal from './MediaPreviewModal';

export function MediaWithSkeleton({ src }: { src: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isGif = src.split('?')[0].endsWith('.gif');

  return (
    <div className="relative w-full aspect-video">
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
            className="relative w-full h-full cursor-pointer aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {isGif ? (
              <img
                src={src}
                alt="Post media"
                className={`rounded-lg h-full w-full object-cover transition-opacity duration-300 ${
                  isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
              />
            ) : (
              <img
                src={src}
                alt="Post media"
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                className={`rounded-lg h-full w-full object-cover transition-opacity duration-300 ${
                  isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}
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
