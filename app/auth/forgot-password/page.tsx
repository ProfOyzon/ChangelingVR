import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ForgotPasswordPageClient from './page.client';

function ForgotPasswordSkeleton() {
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

export default async function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
        <CardDescription>
          Type in your email and we&apos;ll send you a link to reset your password
        </CardDescription>
      </CardHeader>

      <Suspense fallback={<ForgotPasswordSkeleton />}>
        <ForgotPasswordPageClient />
      </Suspense>
    </Card>
  );
}
