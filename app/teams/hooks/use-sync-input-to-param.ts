'use client';

import { useLayoutEffect } from 'react';

export function useSyncInputToParam(ref: React.RefObject<HTMLInputElement | null>, param: string) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.value = new URLSearchParams(window.location.search).get(param) ?? '';
  }, [ref, param]);
}
