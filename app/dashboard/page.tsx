import Image from 'next/image';
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
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getProfileLinks, getUserProfile } from '@/lib/db/queries';
import { cn } from '@/lib/utils';

function randomHeading() {
  const headings = [
    'Ready to uncover the truth?',
    'The mystery awaits your investigation...',
    'Your journey into the unknown continues',
    'What secrets will you discover today?',
    'The veil between worlds grows thin...',
    'Your magical abilities are needed',
    'The family needs your guidance',
    'Time to face the supernatural',
    'Your detective skills are required',
    "The changeling's story unfolds...",
    'Magic and mystery call to you',
    'Your investigation continues...',
    'The truth lies just beyond reach',
    'Ready to protect the innocent?',
    'Your supernatural senses are tingling',
    'The case file awaits your attention',
    'Time to dive deeper into the mystery',
    'Your magical insight is invaluable',
    "The family's fate rests in your hands",
    'Ready to confront the impossible?',
  ];
  return headings[Math.floor(Math.random() * headings.length)];
}

function QuickActions(action: {
  title: string;
  href: string;
  color: string;
  icon: LucideIcon;
  description: string;
}) {
  return (
    <Link key={action.title} href={action.href} className="flex-1">
      <Card
        className={cn('cursor-pointer transition-shadow hover:shadow-md max-md:p-2', action.color)}
      >
        <CardContent className="flex flex-row items-center p-0 text-center md:flex-col md:p-6">
          <div className="rounded-lg p-3">
            <action.icon className="size-6" />
          </div>
          <div>
            <p className="font-semibold">{action.title}</p>
            <p className="text-muted-foreground hidden text-xs md:block">{action.description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default async function DashboardPage() {
  const [profile, links] = await Promise.all([getUserProfile(), getProfileLinks()]);

  if (!profile || !links) {
    return <div>Profile not found</div>;
  }

  // Calculate profile completion
  const completionItems = [
    { key: 'avatar', label: 'Upload Avatar', completed: !!profile.avatar_url },
    { key: 'bio', label: 'Write Bio', completed: !!profile.bio && profile.bio.trim().length > 0 },
    { key: 'roles', label: 'Select Roles', completed: !!profile.roles && profile.roles.length > 0 },
    { key: 'teams', label: 'Join Teams', completed: !!profile.teams && profile.teams.length > 0 },
    { key: 'terms', label: 'Choose Terms', completed: !!profile.terms && profile.terms.length > 0 },
    { key: 'links', label: 'Add Social Links', completed: !!links && links.length > 0 },
  ];

  const completedItems = completionItems.filter((item) => item.completed).length;
  const completionPercentage = (completedItems / completionItems.length) * 100;

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-4">
        <CardContent className="p-0">
          <CardDescription className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Avatar className="size-16 rounded-md">
                <AvatarImage src={profile.avatar_url || '/placeholder.png'} />
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="text-primary text-xl font-semibold">
                  Welcome back, {profile.display_name || profile.username}
                </p>
                <p className="text-muted-foreground">{randomHeading()}</p>
              </div>
            </div>
          </CardDescription>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex flex-1 flex-row gap-4">
          <QuickActions
            title="Edit Profile"
            href="/dashboard/profile"
            color="bg-blue-50 text-blue-600 hover:bg-blue-100"
            icon={UserCheck}
            description="Update your bio and social links"
          />
          <QuickActions
            title="Team & Roles"
            href="/dashboard/assignments"
            color="bg-green-50 text-green-600 hover:bg-green-100"
            icon={Briefcase}
            description="Manage your roles and team assignments"
          />
        </div>
        <div className="flex flex-1 flex-row gap-4">
          <QuickActions
            title="Identity Settings"
            href="/dashboard/identity"
            color="bg-purple-50 text-purple-600 hover:bg-purple-100"
            icon={UserCog}
            description="Update avatar, display name, and username"
          />
          <QuickActions
            title="View Activity"
            href="/dashboard/activity"
            color="bg-orange-50 text-orange-600 hover:bg-orange-100"
            icon={Activity}
            description="Check your recent activity"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>
              Complete your profile to get the most out of your page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-muted-foreground text-sm">
                  {completedItems}/{completionItems.length} completed
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-muted-foreground text-xs">
                {completionPercentage.toFixed(0)}% complete
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              {completionItems.map((item) => {
                const Icon = item.completed ? CheckCircle : Circle;
                return (
                  <div key={item.key} className="flex items-center gap-2">
                    <Icon
                      className={`h-4 w-4 ${item.completed ? 'text-green-600' : 'text-gray-400'}`}
                    />
                    <span
                      className={`text-sm ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <Image src="/man.png" alt="Man" width={100} height={100} />
              <p className="text-muted-foreground text-sm">loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
