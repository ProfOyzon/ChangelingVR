export default function Loading() {
  return (
    <div className="mx-auto my-4 flex w-full max-w-7xl flex-col items-center justify-center gap-6 p-6">
      <div className="h-12 w-96 animate-pulse rounded-md bg-gray-700" />
      <div className="h-12 w-full max-w-2xl animate-pulse rounded-md bg-gray-700" />
      <div className="h-12 w-full max-w-xs animate-pulse rounded-md bg-gray-700" />
      <div className="h-96 w-full animate-pulse rounded-md bg-gray-700" />
    </div>
  );
}
