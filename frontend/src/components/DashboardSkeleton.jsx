import Skeleton from "./ui/Skeleton";

function DashboardSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-ink-900 border border-ink-800 rounded-card p-5 flex items-center gap-5"
        >
          <Skeleton className="w-[72px] h-[72px] rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardSkeleton;