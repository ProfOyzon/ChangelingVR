import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function Terms() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center">
      <h1>Terms of Service?</h1>
    </div>
  );
}
