'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logoutAction } from '../auth/actions';

export default function DashboardNav({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { label: 'Home', href: `/dashboard/${username}` },
    { label: 'Profile', href: `/dashboard/profile/${username}` },
    { label: 'Settings', href: `/dashboard/settings/${username}` },
  ];

  const activeTab = tabs.find((tab) => pathname.startsWith(tab.href))?.href || tabs[0].href;

  return (
    <Card className="max-w-xs mt-6 mb-3 w-full flex-row inline-flex items-center justify-between rounded-lg bg-muted p-1 text-muted-foreground">
      <Tabs value={activeTab} className="flex flex-row items-center gap-2">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.href}
              value={tab.href}
              onClick={() => {
                if (pathname !== tab.href) {
                  router.push(tab.href);
                }
              }}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Button size="sm" onClick={logoutAction}>
        Logout
      </Button>
    </Card>
  );
}
