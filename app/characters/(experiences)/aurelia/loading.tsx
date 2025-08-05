import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center p-6">
      <Loader2 className="size-18 animate-spin" />
    </div>
  );
}
