import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Play Now',
};

export default function Download() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1>Play Now</h1>
    </div>
  );
}
