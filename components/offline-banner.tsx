'use client';

import { useOffline } from 'next/offline';
import { WifiOffIcon } from 'lucide-react';

export function OfflineBanner() {
  const isOffline = useOffline();
  if (!isOffline) return null;

  return (
    <div className="fixed bottom-0 z-100 w-full">
      <div className="bg-light-mustard flex w-full items-center justify-center gap-2 rounded-t-md p-2">
        <WifiOffIcon className="text-midnight size-4" />
        <span className="text-mardi-grass font-bold">
          You are offline. Some functionality may be unavailable.
        </span>
      </div>
    </div>
  );
}
