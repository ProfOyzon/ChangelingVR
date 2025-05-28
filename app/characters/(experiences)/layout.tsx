import { type ReactNode } from 'react';

export default function ExperiencesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="h-16"></div>
      <div className="h-[calc(100vh-4rem)] w-screen">{children}</div>
    </>
  );
}
