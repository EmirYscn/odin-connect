import { useState } from 'react';
import { MAX_POST_CONTENT_LENGTH } from '../lib/utils/constants';
import Button from './Button';

type PostContentProps = {
  content: string;
};

function PostContent({ content }: PostContentProps) {
  const [showFull, setShowFull] = useState(false);

  const isLong = content?.length > MAX_POST_CONTENT_LENGTH;
  const displayedContent = showFull
    ? content
    : content?.slice(0, MAX_POST_CONTENT_LENGTH);

  return (
    content && (
      <p className="break-all text-[var(--color-grey-700)]">
        {displayedContent}
        {!showFull && isLong && (
          <Button
            variation="text"
            onClick={(e) => {
              e.stopPropagation();
              setShowFull(true);
            }}
            className="mt-1"
          >
            Show more
          </Button>
        )}
        {showFull && isLong && (
          <Button
            variation="text"
            onClick={(e) => {
              e.stopPropagation();
              setShowFull(false);
            }}
            className="mt-1"
          >
            Show less
          </Button>
        )}
      </p>
    )
  );
}

export default PostContent;
