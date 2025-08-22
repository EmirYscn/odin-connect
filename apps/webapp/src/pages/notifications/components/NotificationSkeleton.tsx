function NotificationSkeleton() {
  return (
    <div className="flex gap-4 items-center rounded-xl shadow-md border border-[var(--color-grey-100)]/60 px-6 py-4 animate-pulse">
      <span className="rounded-full bg-[var(--color-primary-100)] p-2">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
      </span>
      <div className="w-10 h-10 p-4 bg-gray-300 rounded-full" />
      <div className="flex flex-col justify-center w-full gap-2">
        <div className="flex items-center gap-2">
          <span className="w-24 h-4 bg-gray-300 rounded" />
          <span className="w-32 h-4 bg-gray-200 rounded" />
        </div>
        <span className="w-16 h-3 mt-1 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default NotificationSkeleton;
