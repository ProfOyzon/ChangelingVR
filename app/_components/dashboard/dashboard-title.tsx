'use client';

import { usePathname } from 'next/navigation';

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/activity': 'Activity',
  '/dashboard/assignments': 'Assignments',
  '/dashboard/identity': 'Identity',
  '/dashboard/preview': 'Preview',
  '/dashboard/profile': 'Profile',
};

export function DashboardTitle() {
  const pathname = usePathname();
  const title = routeTitles[pathname] || 'Dashboard';

  return <span className="text-lg font-medium">{title}</span>;
}
