export default function Loading() {
  return (
    <div className="min-h-[calc(100dvh-7.5rem)] bg-slate-900 text-gray-100">
      <div className="border-b border-gray-500/50">
        <div className="mx-auto flex max-w-6xl flex-row items-center justify-between gap-2 px-2 py-8 md:px-4">
          <div className="bg-dune h-10 w-32 animate-pulse rounded-md" />
          <div className="bg-dune h-10 w-24 animate-pulse rounded-md" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-2 py-8 md:px-4">
        <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
          <div className="bg-dune h-14 w-full animate-pulse rounded-md md:h-26" />
          <div className="bg-dune h-14 w-full animate-pulse rounded-md md:h-26" />
          <div className="bg-dune h-14 w-full animate-pulse rounded-md md:h-26" />
          <div className="bg-dune h-14 w-full animate-pulse rounded-md md:h-26" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-dune h-60 w-full animate-pulse rounded-md md:h-92" />
          <div className="bg-dune h-60 w-full animate-pulse rounded-md md:h-92" />
        </div>
      </div>
    </div>
  );
}
