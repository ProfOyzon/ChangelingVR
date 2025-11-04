import { Suspense } from 'react';
import Link from 'next/link';
import ForgotPasswordPageClient from './page.client';

function ForgotPasswordSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-2">
        <div className="h-4 w-12 animate-pulse rounded-md bg-gray-500/50" />
        <div className="h-10 w-full animate-pulse rounded-md bg-gray-500/50" />
      </div>

      <div className="h-10 w-full animate-pulse rounded-md bg-gray-500/50" />
    </div>
  );
}

async function ForgotPasswordModal({ param }: { param: Promise<string> }) {
  const success = await param;

  return success ? (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p className="text-sm text-gray-400">Password reset instructions sent</p>
      </div>

      <p className="text-sm text-gray-200">
        If you registered using your email and password, you will receive a password reset email.
      </p>

      <div className="text-sm">
        Return to{' '}
        <Link href="/auth/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </>
  ) : (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <p className="text-sm text-gray-400">
          Type in your email and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <Suspense fallback={<ForgotPasswordSkeleton />}>
        <ForgotPasswordPageClient />
      </Suspense>

      <div className="text-center text-sm">
        Return to{' '}
        <Link href="/auth/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </>
  );
}

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ success: string }>;
}) {
  const success = searchParams.then((params) => params.success);

  return (
    <>
      <Suspense>
        <ForgotPasswordModal param={success} />
      </Suspense>
    </>
  );
}
