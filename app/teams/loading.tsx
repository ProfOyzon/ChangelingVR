export default function Loading() {
  return (
    <div className="mx-auto animate-pulse p-6">
      <div className="bg-steel/50 mx-auto mb-4 h-10 w-sm rounded-md backdrop-blur-sm"></div>
      <div className="bg-steel/50 mx-auto mb-6 h-10 w-xl rounded-md backdrop-blur-sm"></div>
      <div className="bg-steel/50 mx-auto mb-6 h-10 w-lg rounded-md backdrop-blur-sm"></div>

      <div className="bg-steel/50 h-150 w-full rounded-md backdrop-blur-sm"></div>
    </div>
  );
}
