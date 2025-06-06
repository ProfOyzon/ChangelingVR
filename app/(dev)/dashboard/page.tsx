import { redirect } from 'next/navigation';
import { getActivityLogs, getUserProfile } from '@/lib/db/queries';
import type { Profile } from '@/lib/db/schema';

export default async function DashboardPage() {
  const user = (await getUserProfile()) as Profile;
  if (!user) redirect('/auth/login');

  const logs = await getActivityLogs();
  console.log(logs);

  return <div>Dashboard</div>;
}
