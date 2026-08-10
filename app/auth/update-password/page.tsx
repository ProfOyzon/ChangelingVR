import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { db } from '@/lib/db';
import { resetTokens } from '@/lib/db/schema';
import UpdatePasswordPageClient from './page.client';

export default function Page(props: PageProps<'/auth/update-password'>) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <p className="text-sm text-gray-400">Please enter your new password below.</p>
      </div>
      <Suspense>
        {props.searchParams.then((sp) => {
          const token = sp.token;
          if (!token || typeof token !== 'string') return notFound();
          return <Modal token={token} />;
        })}
      </Suspense>
    </>
  );
}

async function Modal({ token }: { token: string }) {
  const hashedToken = createHash('sha256').update(token).digest('hex');
  const storedToken = await db
    .select({ expiresAt: resetTokens.expiresAt })
    .from(resetTokens)
    .where(eq(resetTokens.token, hashedToken))
    .limit(1);

  if (storedToken.length === 0 || new Date(storedToken[0].expiresAt) < new Date()) {
    return notFound();
  }

  return (
    <Suspense fallback={<UpdatePasswordSkeleton />}>
      <UpdatePasswordPageClient token={token} />
    </Suspense>
  );
}

function UpdatePasswordSkeleton() {
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
