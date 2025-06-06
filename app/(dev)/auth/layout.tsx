import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/db/queries';
import type { Profile } from '@/lib/db/schema';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = (await getUserProfile()) as Profile;
  if (user) redirect('/dashboard');

  return (
    <div className="min-h-[calc(100svh-4rem)] flex w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}
