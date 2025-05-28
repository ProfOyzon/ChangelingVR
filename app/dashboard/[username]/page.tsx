import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('cvr_auth');

  if (!token) {
    redirect('/auth/login');
  }

  console.log(username);

  return <div>Dashboard</div>;
}
