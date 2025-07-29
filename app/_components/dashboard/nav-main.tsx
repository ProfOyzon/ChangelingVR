'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Briefcase, Eye, FileText, Home, UserCog } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Home" asChild isActive={pathname === '/dashboard'}>
              <Link href="/dashboard">
                <Home />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Activity"
              asChild
              isActive={pathname === '/dashboard/activity'}
            >
              <Link href="/dashboard/activity">
                <Activity />
                <span>Activity</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Preview"
              asChild
              isActive={pathname === '/dashboard/preview'}
            >
              <Link href="/dashboard/preview">
                <Eye />
                <span>Preview</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
