import { Suspense } from 'react';
import { headers } from 'next/headers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import RegisterPageClient from './page.client';

function RegisterSkeleton() {
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

      <div className="grid gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Skeleton className="h-10 w-full" />
    </CardContent>
  );
}

export default async function RegisterPage() {
  const header = await headers();
  const ip = (header.get('x-forwarded-for') ?? '::1').split(',')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign up</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <Suspense fallback={<RegisterSkeleton />}>
        <RegisterPageClient ip={ip} />
      </Suspense>
    </Card>
  );
}
