function MediasSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="aspect-video bg-gray-300 animate-pulse rounded-lg"
        />
      ))}
    </div>
  );
}
export default MediasSkeleton;
