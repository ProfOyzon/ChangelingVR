import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/db/queries';
import type { Profile } from '@/lib/db/schema';

export default async function DashboardPage() {
  const user = (await getUserProfile()) as Profile;
  if (!user) redirect('/auth/login');

  return <div>Dashboard</div>;
}
