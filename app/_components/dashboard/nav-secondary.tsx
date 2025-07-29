'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, FileText, UserCog } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavSecondary() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Profile"
              asChild
              isActive={pathname === '/dashboard/profile'}
            >
              <Link href="/dashboard/profile">
                <FileText />
                <span>Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Team & Roles"
              asChild
              isActive={pathname === '/dashboard/assignments'}
            >
              <Link href="/dashboard/assignments">
                <Briefcase />
                <span>Team & Roles</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Identity"
              asChild
              isActive={pathname === '/dashboard/identity'}
            >
              <Link href="/dashboard/identity">
                <UserCog />
                <span>Identity</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
