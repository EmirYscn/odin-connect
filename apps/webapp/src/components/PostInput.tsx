import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { VscSend } from 'react-icons/vsc';
import TextareaAutosize from 'react-textarea-autosize';
import ImagePreview from './ImagePreview';
import ProfileImage from './ProfileImage';
import { FaRegImage } from 'react-icons/fa';
import { useUser } from '../hooks/useUser';
import { useCreatePost } from '../hooks/useCreatePost';

type PostInputProps = {
  placeholder?: string;
  parentPostId?: string; // Optional for replies
};

function PostInput({ placeholder, parentPostId }: PostInputProps) {
  const { user } = useUser();

  const [content, setContent] = useState('');
  const { createPost, isPending } = useCreatePost();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    // Clean up object URLs to avoid memory leaks
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  });

  function handleFileClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...Array.from(files)]);
      console.log(files);
      const newImagePreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews((prev) => [...prev, ...newImagePreviews]);
    }
  };

  const handleCreatePost = () => {
    if (content.trim() === '' && imageFiles.length === 0) {
      return; // Prevent posting empty content
    }

    const postData = {
      content: content.trim(),
      parentId: parentPostId || null, // Include parent post ID if replying
      imageFiles: imageFiles.length > 0 ? imageFiles : undefined,
    };

    createPost(postData, {
      onSuccess: () => {
        setContent(''); // Clear the input after posting
        setImagePreviews([]); // Clear image previews after posting
        setImageFiles([]); // Clear image files after posting
      },
    });
  };

  return (
    <div className="flex flex-col w-full p-8 gap-4 shadow-sm rounded-2xl bg-[var(--color-grey-50)]/20">
      <div className="flex gap-2">
        <div className="align-top">
          <ProfileImage size="sm" imgSrc={user?.avatar} />
        </div>
        <div className="flex flex-col w-full gap-2">
          <TextareaAutosize
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 rounded-lg resize-none focus:outline-none"
            minRows={1}
            placeholder={
              placeholder ? placeholder : "What's on your mind right now?"
            }
          />

          <div
            className={`grid gap-2 ${
              imagePreviews.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            {imagePreviews.length > 0 &&
              imagePreviews.map((imagePreview, idx) => (
                <ImagePreview
                  key={idx}
                  index={idx}
                  imagePreview={imagePreview}
                  setImagePreviews={setImagePreviews}
                  setImageFiles={setImageFiles}
                />
              ))}
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              <Button
                onClick={handleFileClick}
                icon={<FaRegImage />}
                className="text-xl !p-3 hover:bg-[var(--color-brand-100)]/30 transition-all duration-300 ease-in-out !rounded-full"
                disabled={isPending || imagePreviews.length >= 4} // Limit to 4 images
              />
              <input
                type="file"
                name="imageFiles"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="ml-auto">
              <Button
                icon={<VscSend />}
                variation="post"
                iconEnd={true}
                onClick={handleCreatePost}
                disabled={isPending}
                className="hover:bg-[var(--color-brand-100)] transition-all duration-300 ease-in-out"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostInput;
