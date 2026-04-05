export function SkeletonCard() {
  return (
    <div className="bg-surface rounded-lg border border-neutral-200 p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-5 bg-neutral-200 rounded w-1/3" />
        <div className="h-5 bg-neutral-200 rounded w-12" />
      </div>
      <div className="h-3 bg-neutral-200 rounded-full w-full mb-3" />
      <div className="flex justify-between">
        <div className="h-4 bg-neutral-200 rounded w-24" />
        <div className="h-4 bg-neutral-200 rounded w-10" />
        <div className="h-4 bg-neutral-200 rounded w-24" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="bg-surface rounded-md border border-neutral-200 px-4 py-3 flex justify-between items-center animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-neutral-200 rounded w-32" />
        <div className="h-3 bg-neutral-200 rounded w-20" />
      </div>
      <div className="h-5 bg-neutral-200 rounded w-16" />
    </div>
  );
}
