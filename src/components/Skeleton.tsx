interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton-shimmer rounded-xl bg-card/80 ${className}`}
      aria-hidden
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-24 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-28 w-28 rounded-full sm:h-36 sm:w-36" />
        <Skeleton className="h-8 w-48 sm:w-64" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-20 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-56 w-full" />
        <Skeleton className="h-56 w-full" />
      </div>
    </div>
  );
}
