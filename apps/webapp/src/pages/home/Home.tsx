import { useEffect, useRef, useState } from 'react';
import FeedTab, { FeedTabContext } from './components/FeedTab';
import PostInput from '../../components/PostInput';
import Feed from './components/Feed';
import { useSocketPostEvents } from '../../hooks/sockets/useSocketPostEvents';

function Home() {
  const [context, setContext] = useState<FeedTabContext>('foryou');
  useSocketPostEvents();

  // Store scroll positions for each tab
  const scrollPositions = useRef<{ [key in FeedTabContext]: number }>({
    foryou: 0,
    following: 0,
  });

  // handler to save scroll position before switching tab
  const handleTabChange = (newContext: FeedTabContext) => {
    const scrollContainer = document.getElementById('main-content');
    if (scrollContainer) {
      scrollPositions.current[context] = scrollContainer.scrollTop;
    }
    setContext(newContext);
  };

  // Restore scroll position when context changes
  useEffect(() => {
    const scrollContainer = document.getElementById('main-content');
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollPositions.current[context] || 0;
    }
  }, [context]);

  return (
    <div className="flex flex-col items-center justify-items-center font-[family-name:var(--font-geist-sans)] p-4">
      <FeedTab context={context} onTabChange={handleTabChange} />
      <PostInput />
      <Feed context={context} />
    </div>
  );
}

export default Home;
