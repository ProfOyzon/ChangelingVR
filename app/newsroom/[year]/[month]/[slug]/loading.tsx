export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl space-y-4 rounded-md bg-gray-900/50 p-6 backdrop-blur-sm">
      <div className="flex flex-row items-center justify-between">
        <div className="h-8 w-20 animate-pulse rounded-md border border-gray-500 bg-gray-700"></div>

        <div className="flex flex-row gap-2">
          <div className="h-10 w-10 animate-pulse rounded-md border border-gray-500 bg-gray-700"></div>
          <div className="h-10 w-10 animate-pulse rounded-md border border-gray-500 bg-gray-700"></div>
          <div className="h-10 w-10 animate-pulse rounded-md border border-gray-500 bg-gray-700"></div>
        </div>
      </div>

      <div className="h-12 w-3/4 animate-pulse rounded-md bg-gray-700"></div>

      <div className="flex flex-row gap-6">
        <div className="flex flex-row gap-2">
          <div className="h-4 w-8 animate-pulse rounded-md bg-gray-700"></div>
          <div className="h-4 w-32 animate-pulse rounded-md bg-gray-700"></div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="h-4 w-20 animate-pulse rounded-md bg-gray-700"></div>
          <div className="h-4 w-24 animate-pulse rounded-md bg-gray-700"></div>
        </div>
      </div>

      <div className="h-50 w-full animate-pulse rounded-md bg-gray-700"></div>

      <div className="space-y-4">
        <div className="h-4 w-full animate-pulse rounded-md bg-gray-700"></div>
        <div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-700"></div>
        <div className="h-4 w-4/5 animate-pulse rounded-md bg-gray-700"></div>
        <div className="h-4 w-full animate-pulse rounded-md bg-gray-700"></div>
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-700"></div>
        <div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-700"></div>
        <div className="h-4 w-full animate-pulse rounded-md bg-gray-700"></div>
        <div className="h-4 w-4/5 animate-pulse rounded-md bg-gray-700"></div>
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-700"></div>
        <div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-700"></div>
      </div>
    </div>
  );
}
