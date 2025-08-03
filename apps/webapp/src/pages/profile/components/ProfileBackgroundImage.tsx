import { useEffect, useRef, useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { TbCameraPlus } from 'react-icons/tb';
import Button from '../../../components/Button';

type ProfileBackgroundImageProps = {
  imgSrc?: string | null; // URL of the profile background image
  context?: 'edit' | 'profile';
  setBackgroundImageFromFile?: (file: File) => void; // Function to set background image from file
  isUploading?: boolean;
};

function ProfileBackgroundImage({
  imgSrc,
  setBackgroundImageFromFile,
  isUploading = false,
  context = 'profile',
}: ProfileBackgroundImageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [src, setSrc] = useState(imgSrc || null);

  const handleError = () => {
    setSrc(null);
  };

  useEffect(() => {
    if (imgSrc) {
      setSrc(imgSrc);
    }
  }, [imgSrc]);

  function handleImageClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function handleBackgroundImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImageFromFile?.(file);
    }
  }

  function handleBackgroundImageRemove() {
    // TODO
    // create hook to remove background image
  }

  return (
    <div className="relative h-50 w-full">
      {src ? (
        <img
          src={src}
          alt="Profile background"
          className="object-cover rounded-t-md"
          onError={handleError}
        />
      ) : (
        <div className="h-50 w-full bg-[var(--color-grey-300)]/30 rounded-t-md" />
      )}

      {isUploading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
          <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
        </div>
      )}

      {context === 'edit' && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-md gap-4">
          <Button
            icon={<TbCameraPlus className="text-2xl" />}
            onClick={handleImageClick}
            className="!p-4 bg-white/40 text-gray-800 shadow hover:bg-white !rounded-full"
          />
          {/* Button to remove background image, only shown if an image is set */}
          {imgSrc && (
            <Button
              icon={<RxCross2 className="text-2xl" />}
              className="!p-4 bg-white/40 text-gray-800 shadow hover:bg-white !rounded-full"
              onClick={handleBackgroundImageRemove}
            />
          )}
        </div>
      )}

      {context === 'edit' && (
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleBackgroundImageChange}
          disabled={isUploading}
        />
      )}
    </div>
  );
}

export default ProfileBackgroundImage;
