export default function PostSkeleton({ texts }: { texts?: string[] }) {
  return (
    <div className="flex flex-col gap-4 p-8 rounded-2xl mt-2 shadow-sm bg-[var(--color-grey-50)]/40 border-r border-b border-[var(--color-grey-300)]/60 w-full animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="flex-1 h-4 bg-gray-300 rounded" />
      </div>
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-48 bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
        {texts && texts?.map((text, index) => <p key={index}>{text}</p>)}
      </div>
      <div className="flex gap-4 mt-2">
        <div className="w-16 h-6 bg-gray-300 rounded" />
        <div className="w-16 h-6 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
