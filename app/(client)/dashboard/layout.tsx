import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getUserProfile } from '@/lib/db/queries';
import type { Profile } from '@/lib/db/schema';
import { AppSidebar } from '../_components/app-sidebar';
import { DashboardTitle } from '../_components/dashboard-title';
import { ModeToggle } from '../_components/mode-toggle';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Root check for user
  const user = (await getUserProfile()) as Profile;
  if (!user) redirect('/auth/login');

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 pr-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <DashboardTitle />
          </div>

          <ModeToggle />
        </header>
        <div className="p-4 pt-0">
          <Card>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
