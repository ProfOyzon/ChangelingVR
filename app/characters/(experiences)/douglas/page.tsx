import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Douglas',
};

export default function Douglas() {
  return (
    <div className="text-midnight flex h-screen w-screen flex-col items-center justify-center">
      <h1>Placeholder Douglas</h1>
    </div>
  );
}
