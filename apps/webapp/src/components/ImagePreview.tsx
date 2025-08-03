import Modal from "./Modal";
import MediaPreviewModal from "./MediaPreviewModal";

type ImagePreviewsProps = {
  imagePreview: string;
  index: number;
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
};

function ImagePreview({
  imagePreview,
  index,
  setImagePreviews,
  setImageFiles,
}: ImagePreviewsProps) {
  return (
    <div className="relative w-full aspect-video">
      <Modal>
        <Modal.Open opens="preview">
          <div
            className="relative w-full h-full cursor-pointer aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imagePreview}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover rounded-lg border transition-opacity duration-300"
            />
            <button
              type="button"
              className="absolute top-1 right-1 bg-white rounded-full px-2 py-1 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setImagePreviews((prev) => prev.filter((_, i) => i !== index));
                setImageFiles((prev) => prev.filter((_, i) => i !== index));
              }}
            >
              ✕
            </button>
          </div>
        </Modal.Open>
        <Modal.Window
          name="preview"
          className="bg-transparent w-[100%] lg:w-[80%] xl:w-[70%] h-auto shadow-none"
        >
          <MediaPreviewModal previewUrl={imagePreview} />
        </Modal.Window>
      </Modal>
    </div>
  );
}

export default ImagePreview;
