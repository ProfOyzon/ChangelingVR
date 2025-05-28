import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dylan',
};

export default function Dylan() {
  return (
    <div className="text-midnight flex h-screen w-screen flex-col items-center justify-center">
      <h1>Placeholder Dylan</h1>
    </div>
  );
}
