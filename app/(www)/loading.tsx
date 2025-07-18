export default function Loading() {
  return (
    <div className="flex h-[86svh] w-full flex-col items-center justify-center bg-gray-900">
      <div className="mb-5 h-34 w-159 animate-pulse rounded bg-gray-700 px-8" />
      <div className="mx-auto mb-3 h-9 w-76 animate-pulse rounded bg-gray-700" />
      <div className="mx-auto mb-1 h-6 w-148 animate-pulse rounded bg-gray-700" />
      <div className="mx-auto mb-5 h-6 w-50 animate-pulse rounded bg-gray-700" />
      <div className="mx-auto h-13 w-43 animate-pulse rounded-md bg-gray-700" />
    </div>
  );
}
