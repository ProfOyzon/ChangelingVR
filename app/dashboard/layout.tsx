import { Fragment } from 'react';
import { AppSidebar } from '@/app/_components/dashboard/app-sidebar';
import { DashboardTitle } from '@/app/_components/dashboard/dashboard-title';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      <div className="text-primary">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4 pr-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <DashboardTitle />
            </header>
            <div className="p-4 pt-0">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
      <Toaster position="top-center" richColors />
    </Fragment>
  );
}
