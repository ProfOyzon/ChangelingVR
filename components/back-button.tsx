'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      aria-label="Return back"
      onClick={() => router.back()}
      className="bg-light-mustard text-midnight hover:bg-steel hover:text-light-mustard flex items-center justify-center rounded px-4 py-2 font-semibold uppercase shadow-md transition-[transform,background-color,color] duration-300 will-change-transform hover:scale-102 active:scale-95"
    >
      Return Back
    </button>
  );
}
