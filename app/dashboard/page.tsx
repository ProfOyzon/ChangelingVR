import Link from 'next/link';
import { Activity, Briefcase, CheckCircle, Circle, UserCheck, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getProfileLinks, getUserProfile } from '@/lib/db/queries';

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

  // Quick actions
  const quickActions = [
    {
      title: 'Edit Profile',
      description: 'Update your bio and social links',
      icon: UserCheck,
      href: '/dashboard/profile',
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    },
    {
      title: 'Team & Roles',
      description: 'Manage your roles and team assignments',
      icon: Briefcase,
      href: '/dashboard/assignments',
      color: 'bg-green-50 text-green-600 hover:bg-green-100',
    },
    {
      title: 'Identity Settings',
      description: 'Update avatar, display name, and username',
      icon: UserCog,
      href: '/dashboard/identity',
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    },
    {
      title: 'View Activity',
      description: 'Check your recent activity',
      icon: Activity,
      href: '/dashboard/activity',
      color: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
    },
  ];

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
                <p className="text-primary text-xl font-semibold">Welcome back,</p>
                <p className="text-lg">{profile.display_name || profile.username}</p>
              </div>
            </div>
          </CardDescription>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href} className="flex-1">
              <Card className={`cursor-pointer transition-shadow hover:shadow-md ${action.color}`}>
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="rounded-lg p-3">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="font-semibold">{action.title}</p>
                    <p className="text-muted-foreground hidden text-xs md:block">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Profile Completion */}
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
          <CardHeader>
            <CardTitle>Premium Features</CardTitle>
            <CardDescription>
              Unlock premium features to get the most out of your page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
