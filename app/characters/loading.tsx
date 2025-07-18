import { cn } from '@/lib/utils';

export default function Loading() {
  return (
    <div className="h-svh snap-y snap-mandatory overflow-y-scroll">
      <div
        className={cn(
          'absolute top-[10vh] left-0 z-10 flex flex-row gap-1 rounded-md bg-black/25 p-2 backdrop-blur-sm md:ml-6 md:flex-col',
          'animate-pulse max-md:left-1/2 max-md:w-[90%] max-md:-translate-x-1/2 max-md:justify-evenly',
        )}
      >
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-2">
            <div className="h-10 w-10 rounded-full bg-gray-700" />
            <div className="hidden h-4 w-12 rounded bg-gray-700 md:block" />
          </div>
        ))}
      </div>

      <div className="flex h-full w-full items-center justify-center">
        <div
          className="flex w-full max-w-xl animate-pulse flex-col md:max-w-4xl md:flex-row md:items-center md:gap-8"
          style={{ minHeight: '340px', width: '90%' }}
        >
          <div className="hidden items-center justify-center md:flex md:w-1/2">
            <div className="h-80 w-80 rounded-md bg-gray-700" />
          </div>

          <div className="flex w-full flex-col gap-3 rounded-md bg-black/10 p-6 md:w-1/2">
            <div className="mb-2 h-8 w-2/3 rounded bg-gray-700" />

            {[...Array(5)].map((_, j) => (
              <div key={j} className="h-4 w-1/2 rounded bg-gray-700" />
            ))}

            <div className="mt-4 h-4 w-5/6 rounded bg-gray-700" />
            <div className="h-4 w-4/6 rounded bg-gray-700" />
            <div className="mt-6 h-10 w-full rounded-md bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
