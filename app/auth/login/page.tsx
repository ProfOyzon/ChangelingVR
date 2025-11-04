import { Suspense } from 'react';
import Link from 'next/link';
import LoginPageClient from './page.client';

function LoginSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-2">
        <div className="h-4 w-12 animate-pulse rounded-md bg-gray-500/50" />
        <div className="h-10 w-full animate-pulse rounded-md bg-gray-500/50" />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 animate-pulse rounded-md bg-gray-500/50" />
          <div className="h-4 w-32 animate-pulse rounded-md bg-gray-500/50" />
        </div>
        <div className="h-10 w-full animate-pulse rounded-md bg-gray-500/50" />
      </div>

      <div className="h-10 w-full animate-pulse rounded-md bg-gray-500/50" />
    </div>
  );
}

export default async function LoginPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-sm text-gray-400">Enter your email below to login to your account</p>
      </div>

      <Suspense fallback={<LoginSkeleton />}>
        <LoginPageClient />
      </Suspense>

      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </>
  );
}
