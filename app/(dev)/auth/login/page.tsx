import { Suspense } from 'react';
import { headers } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import LoginPageClient from './page.client';

function LoginSkeleton() {
  return (
    <CardContent className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Skeleton className="h-10 w-full" />
    </CardContent>
  );
}

export default async function LoginPage() {
  const header = await headers();
  const ip = (header.get('x-forwarded-for') ?? '::1').split(',')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>

      <Suspense fallback={<LoginSkeleton />}>
        <LoginPageClient ip={ip} />
      </Suspense>
    </Card>
  );
}
