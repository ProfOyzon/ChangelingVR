import { Suspense } from 'react';
import Link from 'next/link';
import ForgotPasswordPageClient from './page.client';

export default function Page(props: PageProps<'/auth/forgot-password'>) {
  return (
    <>
      <Suspense>
        {props.searchParams.then((sp) => {
          const state = typeof sp.success === 'string' ? sp.success : '';
          if (!state) return <PasswordResetForm />;
          return <PasswordResetConfirmation />;
        })}
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

function PasswordResetConfirmation() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Check Your Email</h1>
        <p className="text-sm text-gray-400">Password reset instructions sent</p>
      </div>

      <p className="text-sm text-gray-200">
        If you registered using your email and password, you will receive a password reset email.
      </p>
    </>
  );
}

function PasswordResetForm() {
  return (
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
    </>
  );
}

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
