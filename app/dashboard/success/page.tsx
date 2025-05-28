import { Suspense } from 'react';
import { SuccessCounter } from './page.client';

export default function SuccessPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Profile updated successfully</h1>
      <p className="text-sm text-gray-400">
        Redirecting to profile in{' '}
        <Suspense fallback={<span>...</span>}>
          <SuccessCounter />
        </Suspense>{' '}
        seconds
      </p>
    </div>
  );
}
