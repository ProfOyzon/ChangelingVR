import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kirsten',
};

export default function Kirsten() {
  return (
    <div className="text-midnight flex h-screen w-screen flex-col items-center justify-center">
      <h1>Placeholder Kirsten</h1>
    </div>
  );
}
