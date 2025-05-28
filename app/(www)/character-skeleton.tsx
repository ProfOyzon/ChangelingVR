/**
 * Skeleton loader for the character container.
 */
export function CharacterSkeleton() {
  return (
    <div className="mb-4 animate-pulse">
      <div className="my-4 flex flex-row flex-wrap gap-3 md:gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-10 rounded-full bg-gray-700 md:h-12 md:w-12" />
        ))}
      </div>
      <div className="mb-2 h-6 w-1/4 rounded bg-gray-700" />
      <div className="h-4 w-3/4 rounded bg-gray-700" />
    </div>
  );
}
