import Link from 'next/link';
import {
  Activity,
  Briefcase,
  CheckCircle,
  Circle,
  type LucideIcon,
  UserCheck,
  UserCog,
} from 'lucide-react';
import { CopyLink } from '@/components/copy-link';
import { getFullProfile } from '@/lib/db/queries';
import type { FullProfile } from '@/lib/db/schema';
import { cn } from '@/lib/utils';

function QuickActions(action: {
  title: string;
  href: string;
  color: string;
  icon: LucideIcon;
  description: string;
}) {
  return (
    <Link key={action.title} href={action.href}>
      <div className={cn('flex gap-2 rounded-md p-4 md:flex-col', action.color)}>
        <action.icon className="size-6" />

        <div className="flex flex-col">
          <p className="font-semibold">{action.title}</p>
          <p className="text-muted-foreground hidden text-xs md:block">{action.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const profile = (await getFullProfile()) as FullProfile;
  if (!profile) {
    return <div>Profile not found</div>;
  }

  // Calculate profile completion
  const completionItems = [
    { key: 'avatar', label: 'Upload Avatar', completed: !!profile.avatarUrl },
    { key: 'bio', label: 'Write Bio', completed: !!profile.bio && profile.bio.trim().length > 0 },
    { key: 'roles', label: 'Select Roles', completed: !!profile.roles && profile.roles.length > 0 },
    { key: 'teams', label: 'Join Teams', completed: !!profile.teams && profile.teams.length > 0 },
    { key: 'terms', label: 'Choose Terms', completed: !!profile.terms && profile.terms.length > 0 },
    {
      key: 'links',
      label: 'Add Social Links',
      completed: !!profile.links && profile.links.length > 0,
    },
  ];

  const completedItems = completionItems.filter((item) => item.completed).length;
  const completionPercentage = (completedItems / completionItems.length) * 100;

  return (
    <main className="min-h-[calc(100dvh-7.5rem)] bg-slate-900 text-gray-100">
      <header className="border-b border-gray-500/50">
        <div className="mx-auto flex max-w-6xl flex-row items-center justify-between gap-2 px-4 py-8">
          <h1 className="text-4xl font-bold">{profile.displayName}</h1>
          <CopyLink
            url={`https://changelingvr.com/users/${profile.username}`}
            className="bg-dune flex items-center gap-2 rounded-md px-4 py-2 text-white"
          >
            Share Profile
          </CopyLink>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
        <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
          <QuickActions
            title="Profile"
            href="/dashboard/profile"
            color="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-600/80"
            icon={UserCheck}
            description="Update your bio and info"
          />
          <QuickActions
            title="Activity"
            href="/dashboard/activity"
            color="bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-600/80"
            icon={Activity}
            description="View recent activity"
          />
          <QuickActions
            title="Preview"
            href="/dashboard/preview"
            color="bg-green-50 text-green-600 hover:bg-green-100 border border-green-600/80"
            icon={Briefcase}
            description="Preview your profile"
          />
          <QuickActions
            title="Settings"
            href="/dashboard/settings"
            color="bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-600/80"
            icon={UserCog}
            description="Account settings"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="space-y-4 rounded-md border border-gray-500/50 bg-slate-800 p-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">Profile Completion</h2>
              <p className="text-sm text-gray-400">
                Complete your profile to get the most out of your page.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="h-2 w-full rounded-full bg-gray-500/50">
                <div
                  className="h-2 w-full rounded-full bg-green-600"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{completionPercentage.toFixed(0)}% complete</p>
            </div>

            <div className="border-t border-gray-500/50 pt-2" />

            <div className="space-y-2">
              {completionItems.map((item) => {
                const Icon = item.completed ? CheckCircle : Circle;
                return (
                  <div key={item.key} className="flex items-center gap-2">
                    <Icon
                      className={`h-4 w-4 ${item.completed ? 'text-green-600' : 'text-gray-400'}`}
                    />
                    <span
                      className={`text-sm ${item.completed ? 'text-gray-300' : 'text-gray-400'}`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-md border border-gray-500/50 bg-slate-800 p-4">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4 text-yellow-500"
            >
              <path
                d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                fill="currentColor"
              />
            </svg>
            <p className="text-center text-xl font-semibold">
              we don&apos;t know what to put here LOLOL
            </p>
            <p className="text-muted-foreground text-center text-sm">
              it looks off without a section tho
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
