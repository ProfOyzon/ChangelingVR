export function PageLoading() {
  return (
    <div className="flex flex-wrap justify-center gap-6 mb-6">
      {[...Array(20)].map((_, index) => (
        <div
          key={index}
          className="w-40 min-w-40 max-w-40 h-64 mx-auto animate-pulse bg-steel/50 backdrop-blur-sm rounded"
        >
          <div className="w-full h-40 bg-steel/50 backdrop-blur-sm rounded"></div>
          <div className="p-2 w-full space-y-1">
            <div className="h-4 bg-steel/50 backdrop-blur-sm rounded"></div>
            <div className="h-10 bg-steel/50 backdrop-blur-sm rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
