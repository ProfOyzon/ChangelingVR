import { Suspense } from 'react';
import { createHash } from 'node:crypto';
import { db } from '@/lib/db';
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
          return <Modal token={token} />;
        })}
      </Suspense>
    </>
  );
}

async function Modal({ token }: { token: string | string[] | undefined }) {
  let error: string | null = '✖ Invalid or expired token.';
  if (!token || Array.isArray(token)) {
    return (
      <Suspense fallback={<UpdatePasswordSkeleton />}>
        <UpdatePasswordPageClient token="" error={error} />
      </Suspense>
    );
  }

  const hashedToken = createHash('sha256').update(token).digest('hex');
  const storedToken = await db.query.resetTokens.findFirst({
    where: { token: hashedToken },
    columns: { expiresAt: true },
  });

  // Token exists and not expired, clear error
  if (storedToken && new Date(storedToken.expiresAt) > new Date()) {
    error = null;
  }

  return (
    <Suspense fallback={<UpdatePasswordSkeleton />}>
      <UpdatePasswordPageClient token={token} error={error} />
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
