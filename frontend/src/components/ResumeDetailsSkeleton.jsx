import Skeleton from "./ui/Skeleton";

function ResumeDetailsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto">
      <Skeleton className="h-9 w-40 mb-6 rounded-lg" />

      <div className="bg-ink-900 border border-ink-800 rounded-card p-8">
        <Skeleton className="h-7 w-64 mb-8" />

        <div className="flex flex-col items-center py-6">
          <Skeleton className="w-36 h-36 rounded-full" />
          <Skeleton className="h-4 w-32 mt-4" />
        </div>

        <div className="mt-8 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        <div className="mt-8 space-y-3">
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeDetailsSkeleton;