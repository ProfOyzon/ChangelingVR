import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aurelia',
};

export default function Aurelia() {
  return (
    <div className="text-midnight flex h-screen w-screen flex-col items-center justify-center">
      <h1>Placeholder Aurelia</h1>
    </div>
  );
}
