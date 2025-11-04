'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_LABELS: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/profile': 'Profile',
  '/dashboard/activity': 'Activity',
  '/dashboard/preview': 'Preview',
  '/dashboard/connections': 'Connections',
  '/dashboard/settings': 'Settings',
};

export function Submenu() {
  const pathname = usePathname();

  return (
    <div className="flex items-center px-2 text-gray-300 md:px-4">
      {Object.entries(NAV_LABELS).map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className={cn('shrink-0 py-2', pathname === href && 'border-b-2 border-white text-white')}
        >
          <div className="rounded-sm px-3 py-2 hover:bg-zinc-800 hover:text-white">{label}</div>
        </Link>
      ))}
    </div>
  );
}
