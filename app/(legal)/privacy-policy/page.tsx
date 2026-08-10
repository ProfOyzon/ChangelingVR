import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
};

export default function Privacy() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center">
      <h1>Privacy Policy</h1>
    </div>
  );
}
