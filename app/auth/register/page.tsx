import { Suspense } from 'react';
import Link from 'next/link';
import RegisterPageClient from './page.client';

function RegisterSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-2">
        <div className="h-4 w-12 animate-pulse rounded-md bg-gray-500/50" />
        <div className="h-10 w-full animate-pulse rounded-md bg-gray-500/50" />
      </div>

      <div className="grid gap-2">
        <div className="h-4 w-16 animate-pulse rounded-md bg-gray-500/50" />
        <div className="h-10 w-full animate-pulse rounded-md bg-gray-500/50" />
      </div>

      <div className="grid gap-2">
        <div className="h-4 w-20 animate-pulse rounded-md bg-gray-500/50" />
        <div className="h-10 w-full animate-pulse rounded-md bg-gray-500/50" />
      </div>

      <div className="h-10 w-full animate-pulse rounded-md bg-gray-500/50" />
    </div>
  );
}

export default async function RegisterPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Sign up</h1>
        <p className="text-sm text-gray-400">Create a new account</p>
      </div>

      <Suspense fallback={<RegisterSkeleton />}>
        <RegisterPageClient />
      </Suspense>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </>
  );
}
