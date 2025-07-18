import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { AppSidebar } from '../_components/dashboard/app-sidebar';
import { DashboardTitle } from '../_components/dashboard/dashboard-title';
import { ModeToggle } from '../_components/dashboard/mode-toggle';
import { ThemeProvider } from '../_components/dashboard/theme-provider';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="text-primary">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 pr-4">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
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
      </div>
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}
