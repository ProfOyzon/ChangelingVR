'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthClientPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBoxClick = async () => {
    setIsLoading(true);

    // Generate a random token and delay (1-2 seconds)
    const randomToken =
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const randomDelay = Math.floor(Math.random() * 1000) + 1000;

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, randomDelay));

    // Redirect to the main aurelia page with the token
    router.push(`/characters/aurelia?t=${randomToken}`);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-row items-center justify-center gap-2">
      {isLoading ? (
        <Loader2 className="size-12 animate-spin" />
      ) : (
        <div
          className={`size-12 cursor-pointer rounded-lg border-2 border-gray-300 bg-white transition-all duration-200 hover:border-gray-400`}
          onClick={handleBoxClick}
        />
      )}
      <p className="text-lg font-bold">I&apos;m not a demon</p>
    </div>
  );
}
