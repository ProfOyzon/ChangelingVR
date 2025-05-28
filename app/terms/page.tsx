import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function Terms() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1>Terms of Service?</h1>
    </div>
  );
}
