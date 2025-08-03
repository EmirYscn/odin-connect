import { useState } from 'react';
import FeedTab, { FeedTabContext } from './components/FeedTab';
import PostInput from '../../components/PostInput';
import Feed from './components/Feed';
import { useSocketPostEvents } from '../../hooks/sockets/useSocketPostEvents';

function Home() {
  const [context, setContext] = useState<FeedTabContext>('foryou');
  useSocketPostEvents();

  return (
    <div className="flex flex-col items-center justify-items-center font-[family-name:var(--font-geist-sans)] p-4">
      <FeedTab context={context} setContext={setContext} />
      <PostInput />
      <Feed context={context} />
    </div>
  );
}

export default Home;
