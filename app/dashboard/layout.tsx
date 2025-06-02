import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { verify } from 'jsonwebtoken';
import DashboardNav from './dashboard-nav';

interface JwtPayload {
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Get the auth token from the cookie store
  const cookieStore = await cookies();
  const token = cookieStore.get('cvr_auth');

  // Initial auth check
  // If the token is not found, redirect to the login page
  if (!token || token.name !== 'cvr_auth') {
    redirect('/auth/login');
  }

  // Verify the token
  const decoded = verify(token.value, process.env.JWT_ACCESS_SECRET!) as JwtPayload;

  // Check if the token is expired
  if (decoded.exp < Date.now() / 1000) {
    redirect('/auth/login');
  }

  return (
    <div className="w-full flex flex-col px-6 items-center">
      <DashboardNav username={decoded.username} />

      <Card className="w-full max-w-5xl h-full mb-6">
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
