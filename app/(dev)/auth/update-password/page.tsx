import { Suspense } from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { verifyToken } from '@/lib/auth/session';
import UpdatePasswordPageClient from './page.client';

function UpdatePasswordSkeleton() {
  return (
    <CardContent className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-10 w-full" />
      </div>

      <Skeleton className="h-10 w-full" />
    </CardContent>
  );
}

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const header = await headers();
  const ip = (header.get('x-forwarded-for') ?? '::1').split(',')[0];

  // If the token is not provided, return not found
  const { token } = await searchParams;
  if (!token) return notFound();

  // If the token is invalid, return not found
  const tokenData = await verifyToken(token);
  if (!tokenData || !tokenData.user || typeof tokenData.user.id !== 'string') {
    return notFound();
  }

  // If the token has expired, return not found
  if (new Date(tokenData.expires) < new Date()) return notFound();

  // db check uuid

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        <CardDescription>Please enter your new password below.</CardDescription>
      </CardHeader>

      <Suspense fallback={<UpdatePasswordSkeleton />}>
        <UpdatePasswordPageClient ip={ip} token={token} />
      </Suspense>
    </Card>
  );
}
