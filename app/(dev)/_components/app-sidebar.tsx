import Image from 'next/image';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Profile } from '@/lib/db/schema';
import { Home, LifeBuoy, Settings, User } from 'lucide-react';
import { NavUser } from './user-nav';

// const item = [
//   {
//     title: 'Getting Started',
//     url: '#',
//     items: [
//       {
//         title: 'Installation',
//         url: '#',
//       },
//       {
//         title: 'Project Structure',
//         url: '#',
//       },
//     ],
//   },
//   {
//     title: 'Building Your Application',
//     url: '#',
//     items: [
//       {
//         title: 'Routing',
//         url: '#',
//       },
//       {
//         title: 'Data Fetching',
//         url: '#',
//         isActive: true,
//       },
//       {
//         title: 'Rendering',
//         url: '#',
//       },
//       {
//         title: 'Caching',
//         url: '#',
//       },
//       {
//         title: 'Styling',
//         url: '#',
//       },
//       {
//         title: 'Optimizing',
//         url: '#',
//       },
//       {
//         title: 'Configuring',
//         url: '#',
//       },
//       {
//         title: 'Testing',
//         url: '#',
//       },
//       {
//         title: 'Authentication',
//         url: '#',
//       },
//       {
//         title: 'Deploying',
//         url: '#',
//       },
//       {
//         title: 'Upgrading',
//         url: '#',
//       },
//       {
//         title: 'Examples',
//         url: '#',
//       },
//     ],
//   },
//   {
//     title: 'API Reference',
//     url: '#',
//     items: [
//       {
//         title: 'Components',
//         url: '#',
//       },
//       {
//         title: 'File Conventions',
//         url: '#',
//       },
//       {
//         title: 'Functions',
//         url: '#',
//       },
//       {
//         title: 'next.config.js Options',
//         url: '#',
//       },
//       {
//         title: 'CLI',
//         url: '#',
//       },
//       {
//         title: 'Edge Runtime',
//         url: '#',
//       },
//     ],
//   },
//   {
//     title: 'Architecture',
//     url: '#',
//     items: [
//       {
//         title: 'Accessibility',
//         url: '#',
//       },
//       {
//         title: 'Fast Refresh',
//         url: '#',
//       },
//       {
//         title: 'Next.js Compiler',
//         url: '#',
//       },
//       {
//         title: 'Supported Browsers',
//         url: '#',
//       },
//       {
//         title: 'Turbopack',
//         url: '#',
//       },
//     ],
//   },
// ];

export function AppSidebar({ email, user }: { email: string; user: Profile }) {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
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
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Overview" asChild>
                  <Link href="/dashboard">
                    <Home />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile" asChild>
                  <Link href="/dashboard/profile">
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings" asChild>
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" asChild>
                  <Link href="/dashboard/profile">
                    <LifeBuoy />
                    <span>Help</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" asChild>
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          name={user.display_name || user.username}
          email={email}
          avatar={user.avatar_url || ''}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
