/**
 * Loading skeleton for the news container.
 */
export function NewsSkeleton() {
  return (
    <div className="mb-6 flex animate-pulse flex-col justify-evenly gap-6 md:flex-row">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-1 flex-col items-center rounded">
          <div className="h-50 max-h-50 w-full rounded-t bg-gray-700" />
          <div className="w-full p-4">
            <div className="mb-1 flex gap-2">
              <div className="h-4 w-20 rounded bg-gray-700" />
              <div className="h-4 w-4 rounded bg-gray-700" />
              <div className="h-4 w-24 rounded bg-gray-700" />
            </div>
            <div className="mt-2 h-6 w-3/4 rounded bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
