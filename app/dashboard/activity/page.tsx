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
  return date.toLocaleDateString();
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
        <ul className="space-y-4">
          {logs.map((log) => {
            const Icon = iconMap[log.action as ActivityType] || Settings;
            const formattedAction = formatAction(log.action as ActivityType);

            return (
              <li key={log.id} className="flex items-center space-x-4">
                <div className="rounded-full bg-orange-100 p-2">
                  <Icon className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {formattedAction} {log.ip_address && ` from ${log.city}, ${log.region}`}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {getRelativeTime(new Date(log.timestamp))}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
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
