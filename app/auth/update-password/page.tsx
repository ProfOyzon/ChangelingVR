import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/db';
import { resetTokens } from '@/lib/db/schema';
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
  // If the token is not provided, return not found
  const { token } = await searchParams;
  if (!token) return notFound();

  // Hash the token the same way and check if it exists in the database
  const hashedToken = createHash('sha256').update(token).digest('hex');
  const storedToken = await db
    .select()
    .from(resetTokens)
    .where(eq(resetTokens.token, hashedToken))
    .limit(1);

  // If no token found or token expired, return not found
  if (storedToken.length === 0 || storedToken[0].expires_at < new Date()) {
    return notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        <CardDescription>Please enter your new password below.</CardDescription>
      </CardHeader>

      <Suspense fallback={<UpdatePasswordSkeleton />}>
        <UpdatePasswordPageClient token={token} />
      </Suspense>
    </Card>
  );
}
