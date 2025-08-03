'use client';

import { useEffect } from 'react';
import PostSkeleton from '../../components/PostSkeleton';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 4000); // Redirect after 4 seconds
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col px-4">
      <div className="w-full mb-8">
        <PostSkeleton
          texts={['Post Not Found', 'Redirecting you to the home page...']}
        />
      </div>
    </div>
  );
}

export default NotFound;
