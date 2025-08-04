import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-24 w-full rounded-lg" />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 flex-row gap-4">
          <Skeleton className="h-40 flex-1 rounded-lg" />
          <Skeleton className="h-40 flex-1 rounded-lg" />
        </div>

        <div className="flex flex-1 flex-row gap-4">
          <Skeleton className="h-40 flex-1 rounded-lg" />
          <Skeleton className="h-40 flex-1 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}
