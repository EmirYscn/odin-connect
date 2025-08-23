export type FeedTabContext = 'foryou' | 'following';

type FeedTabProps = {
  context: FeedTabContext;
  onTabChange: (context: FeedTabContext) => void;
};

function FeedTab({ context, onTabChange }: FeedTabProps) {
  return (
    <div className="flex justify-center w-full sticky text-[var(--color-grey-700)] top-0 z-10 cursor-pointer mb-3 shadow-md backdrop-blur-md rounded-xl">
      <div
        onClick={() => {
          if (context === 'foryou') {
            // scroll to top if already on the same tab
            const scrollContainer = document.getElementById('main-content');
            if (scrollContainer) {
              scrollContainer.scrollTo({ top: 0, behavior: 'smooth' }); // Scrolls to top
            }
          }
          onTabChange('foryou');
        }}
        className={`text-center w-full py-4 px-6 border-b ${
          context === 'foryou'
            ? 'border-b-4 border-[var(--color-brand-100)]'
            : 'border-gray-400/40'
        } hover:bg-[var(--color-brand-100)]/30 transition-all duration-300 ease-in-out rounded-bl-xl rounded-tl-xl`}
      >
        <span>For you</span>
      </div>
      <div
        onClick={() => {
          if (context === 'following') {
            // scroll to top if already on the same tab
            const scrollContainer = document.getElementById('main-content');
            if (scrollContainer) {
              scrollContainer.scrollTo({ top: 0, behavior: 'smooth' }); // Scrolls to top
            }
          }
          onTabChange('following');
        }}
        className={`text-center w-full py-4 px-6 border-b ${
          context === 'following'
            ? 'border-b-4 border-[var(--color-brand-100)]'
            : 'border-gray-400/40'
        } hover:bg-[var(--color-brand-100)]/30 transition-all duration-300 ease-in-out rounded-br-xl rounded-tr-xl`}
      >
        <span>Following</span>
      </div>
    </div>
  );
}

export default FeedTab;
