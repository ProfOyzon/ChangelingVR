'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoaded(true);
    const handleError = () => setIsLoaded(false);

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={cn(
        'absolute h-full w-full object-cover brightness-50 transition-opacity duration-500',
        isLoaded ? 'opacity-100' : 'opacity-0',
      )}
      poster="/media/background/outside_blurred.webp"
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-hidden="true"
    >
      <source src="/media/video/ChangelingTrailer2024.mp4" type="video/mp4" />
    </video>
  );
}
