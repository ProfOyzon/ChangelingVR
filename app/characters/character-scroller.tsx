'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function CharacterScroller() {
  const params = useSearchParams();

  useEffect(() => {
    const characterId = params.get('c');
    if (!characterId) return;

    const container = document.getElementById('character-scroll');
    const target = document.getElementById(characterId);
    if (!container || !target) return;

    container.scrollTo({
      top: target.offsetTop - container.offsetTop,
      behavior: 'smooth',
    });
  }, [params]);

  return null;
}
