export default function Loading() {
  return (
    <div className="relative flex min-h-[calc(100vh-10rem)] w-full items-center justify-center p-6">
      <div className="h-50 w-full max-w-4xl animate-pulse rounded-md bg-gray-700"></div>
      <div className="absolute top-4 left-4 h-10 w-40 animate-pulse rounded-md bg-gray-700"></div>
    </div>
  );
}
