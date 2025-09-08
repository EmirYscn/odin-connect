import WhoToFollow from './WhoToFollow';

function MiscSidebar() {
  return (
    <div className="flex flex-col h-full gap-4 p-4 ">
      <div className="h-40 rounded-2xl shadow-md bg-[var(--color-grey-50)]/20">
        <WhoToFollow />
      </div>
      <div className="h-40 rounded-2xl shadow-md bg-[var(--color-grey-50)]/20"></div>
      <div className="flex items-center h-40 gap-2">
        <div className="h-full w-1/2 rounded-2xl shadow-md bg-[var(--color-grey-50)]/20"></div>
        <div className="h-full w-1/2 rounded-2xl shadow-md bg-[var(--color-grey-50)]/20"></div>
      </div>
    </div>
  );
}

export default MiscSidebar;
