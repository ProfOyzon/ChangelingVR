import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verify } from 'jsonwebtoken';

type JwtUserPayload = {
  id: number;
  username: string;
  email: string;
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('cvr_auth');

  if (token) {
    // Token found, decode it and redirect to dashboard
    const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtUserPayload;
    redirect(`/dashboard/profile/${decoded.username}`);
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  );
}
