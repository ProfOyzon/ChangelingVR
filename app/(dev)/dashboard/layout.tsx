import { redirect } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getUserProfile } from '@/lib/db/queries';
import type { Profile } from '@/types';
import { AppSidebar } from '../_components/app-sidebar';
import { ModeToggle } from '../_components/mode-toggle';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = (await getUserProfile()) as Profile;
  if (!user) redirect('/auth/login');

  return (
    <SidebarProvider>
      <AppSidebar email={user.username} user={user} />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 pr-4">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <span className="text-lg font-medium">Dashboard</span>
          </div>

          <ModeToggle />
        </header>
        <div className="p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
