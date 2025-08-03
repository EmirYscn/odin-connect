type MediaPreviewModalProps = {
  previewUrl: string;
};

export default function MediaPreviewModal({
  previewUrl,
}: MediaPreviewModalProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <img
        src={previewUrl}
        alt="Preview"
        width={800}
        height={600}
        className="max-w-full max-h-[80vh] rounded-xl object-contain"
        style={{ width: 'auto', height: 'auto' }}
      />
    </div>
  );
}
