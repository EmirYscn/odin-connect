function ProfileHeaderSkeleton() {
  return (
    <>
      <div className="relative">
        <div className="h-50 bg-amber-700 animate-pulse" />
        <div className="absolute left-4 -bottom-12">
          <div className="w-42 h-42 rounded-full bg-gray-300 border-4 border-white shadow-lg animate-pulse" />
        </div>
      </div>
      <div className="h-12" />
      <div className="p-2 flex flex-col gap-4">
        <div className="h-6 w-40 bg-gray-300 rounded animate-pulse" />
        <div className="h-4 w-60 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex gap-4 text-sm">
          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </>
  );
}

export default ProfileHeaderSkeleton;
