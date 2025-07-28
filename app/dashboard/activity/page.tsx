import { Fragment } from 'react';
import {
  AlertCircle,
  Lock,
  LogOut,
  type LucideIcon,
  Settings,
  UserCog,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { getActivityLogs } from '@/lib/db/queries';
import { ActivityType } from '@/lib/db/schema';

const iconMap: Record<ActivityType, LucideIcon> = {
  [ActivityType.SIGN_UP]: UserPlus,
  [ActivityType.SIGN_IN]: UserCog,
  [ActivityType.SIGN_OUT]: LogOut,
  [ActivityType.UPDATE_PASSWORD]: Lock,
  [ActivityType.DELETE_ACCOUNT]: UserMinus,
  [ActivityType.UPDATE_ACCOUNT]: Settings,
};

function getRelativeTime(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatAction(action: ActivityType): string {
  switch (action) {
    case ActivityType.SIGN_UP:
      return 'You signed up';
    case ActivityType.SIGN_IN:
      return 'You signed in';
    case ActivityType.SIGN_OUT:
      return 'You signed out';
    case ActivityType.UPDATE_PASSWORD:
      return 'You changed your password';
    case ActivityType.DELETE_ACCOUNT:
      return 'You deleted your account';
    case ActivityType.UPDATE_ACCOUNT:
      return 'You updated your account';
    default:
      return 'Unknown action occurred';
  }
}

export default async function ActivityPage() {
  const logs = await getActivityLogs();

  return (
    <Fragment>
      {logs.length > 0 ? (
        <div className="flex flex-col gap-2">
          {logs.map((log) => {
            const Icon = iconMap[log.action as ActivityType] || Settings;
            const formattedAction = formatAction(log.action as ActivityType);

            return (
              <Card key={log.id} className="p-3.5">
                <CardContent className="flex flex-col gap-2 p-0">
                  <CardDescription className="flex flex-row items-center gap-2">
                    <div className="rounded-full bg-orange-100 p-2">
                      <Icon className="size-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {formattedAction} {log.ip_address && ` from ${log.city}, ${log.region}`}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {getRelativeTime(new Date(log.timestamp))}
                      </p>
                    </div>
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="text-light-mustard mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No activity yet</h3>
          <p className="text-muted-foreground max-w-sm text-sm">
            When you perform actions like signing in or updating your account, they&apos;ll appear
            here.
          </p>
        </div>
      )}
    </Fragment>
  );
}
