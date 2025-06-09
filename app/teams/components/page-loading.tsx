export function PageLoading() {
  return (
    <div className="mb-6 flex flex-wrap justify-center gap-6">
      {[...Array(20)].map((_, index) => (
        <div
          key={index}
          className="bg-steel/50 mx-auto h-64 w-40 max-w-40 min-w-40 animate-pulse rounded backdrop-blur-sm"
        >
          <div className="bg-steel/50 h-40 w-full rounded backdrop-blur-sm"></div>
          <div className="w-full space-y-1 p-2">
            <div className="bg-steel/50 h-4 rounded backdrop-blur-sm"></div>
            <div className="bg-steel/50 h-10 rounded backdrop-blur-sm"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
