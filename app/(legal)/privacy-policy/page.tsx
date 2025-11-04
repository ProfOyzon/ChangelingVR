import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
};

export default async function Privacy() {
  'use cache';
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1>Privacy Policy</h1>
    </div>
  );
}
