import { redirect } from 'next/navigation';
import { getUserProfile } from '@/lib/db/queries';

export default async function SettingsPage() {
  const user = await getUserProfile();
  if (!user) redirect('/auth/login');

  return <div>Settings</div>;
}
