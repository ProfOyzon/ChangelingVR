export default function Loading() {
  return (
    <div className="relative flex h-[88svh] w-full items-center justify-center text-center">
      <div className="absolute h-full w-full animate-pulse bg-gray-900"></div>
      <div className="relative z-5 mx-auto max-w-2xl px-4">
        <div className="mb-4 px-8">
          <div className="mx-auto h-20 w-80 animate-pulse rounded-md bg-gray-700"></div>
        </div>
        <div className="mx-auto mb-2 h-8 w-64 animate-pulse rounded-md bg-gray-700"></div>
        <div className="mx-auto mb-8 h-6 w-96 animate-pulse rounded-md bg-gray-700 px-8"></div>
        <div className="flex justify-center">
          <div className="h-12 w-32 animate-pulse rounded-md bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
}
