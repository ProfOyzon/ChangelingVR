'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function SuccessCounter() {
  const [countdown, setCountdown] = useState<number>(5);
  const router = useRouter();

  // Get the uid from the search params
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');

  useEffect(() => {
    if (countdown === 0) {
      router.replace(`/dashboard?uid=${uid ?? ''}`);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown, router, uid]);

  return <span className="text-sm text-gray-300">{countdown}</span>;
}
