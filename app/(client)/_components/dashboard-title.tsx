'use client';

import { usePathname } from 'next/navigation';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/activity': 'Activity',
  '/dashboard/preview': 'Preview',
  '/dashboard/profile': 'Profile',
  '/dashboard/settings': 'Settings',
  '/dashboard/avatar': 'Avatar',
};

export function DashboardTitle() {
  const pathname = usePathname();
  const title = routeTitles[pathname] || 'Dashboard';

  return <span className="text-lg font-medium">{title}</span>;
}
