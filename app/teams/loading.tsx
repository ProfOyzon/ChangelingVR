export default function Loading() {
  return (
    <div className="p-6 mx-auto animate-pulse">
      <div className="h-10 w-sm bg-steel/50 backdrop-blur-sm rounded mb-4 mx-auto"></div>
      <div className="h-10 w-xl bg-steel/50 backdrop-blur-sm rounded mb-6 mx-auto"></div>
      <div className="h-10 w-lg bg-steel/50 backdrop-blur-sm rounded mb-6 mx-auto"></div>

      <div className="h-svh w-full bg-steel/50 backdrop-blur-sm rounded"></div>
    </div>
  );
}
