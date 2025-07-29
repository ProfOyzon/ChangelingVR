import Image from 'next/image';
import { LogoutButton } from '@/app/_components/dashboard/logout-button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <Image src="/logo_v2.svg" alt="Logo" width={32} height={32} className="w-full" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Changeling VR</span>
                <span className="truncate text-xs">Developer Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
        <NavSecondary />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log out" asChild>
              <LogoutButton />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
