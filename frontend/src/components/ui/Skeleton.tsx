export function SkeletonCard({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return (
      <div className="bg-[#ffede5] rounded-xl overflow-hidden animate-pulse">
        <div className="aspect-video bg-[#ffd4bd]" />
        <div className="p-5 space-y-3">
          <div className="flex justify-between">
            <div className="h-5 bg-[#ffd4bd] rounded w-2/3" />
            <div className="h-5 bg-[#ffd4bd] rounded w-1/6" />
          </div>
          <div className="h-3 bg-[#ffe3d4] rounded w-full" />
          <div className="h-3 bg-[#ffe3d4] rounded w-4/5" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex bg-[#ffede5] rounded-xl overflow-hidden animate-pulse h-28">
      <div className="w-1/3 bg-[#ffd4bd]" />
      <div className="w-2/3 p-4 space-y-2">
        <div className="h-4 bg-[#ffd4bd] rounded w-3/4" />
        <div className="h-3 bg-[#ffe3d4] rounded w-full" />
        <div className="h-3 bg-[#ffe3d4] rounded w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SkeletonCard featured />
        <div className="flex flex-col gap-4">
          {Array.from({ length: Math.min(count - 1, 3) }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonCategoryTabs() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 animate-pulse -mx-4 px-4 py-2">
      {[80, 100, 90, 110, 75].map((w, i) => (
        <div key={i} className="h-9 bg-[#ffd4bd] rounded-full flex-shrink-0" style={{ width: `${w}px` }} />
      ))}
    </div>
  );
}
