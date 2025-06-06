import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getActivityLogs } from '@/lib/db/queries';
import { ActivityType } from '@/lib/db/schema';
import {
  Lock,
  LogOut,
  type LucideIcon,
  Settings,
  UserCog,
  UserMinus,
  UserPlus,
} from 'lucide-react';

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
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>

      {logs.length > 0 ? (
        <CardContent>
          <ul className="space-y-4">
            {logs.map((log) => {
              const Icon = iconMap[log.action as ActivityType] || Settings;
              const formattedAction = formatAction(log.action as ActivityType);

              return (
                <li key={log.id} className="flex items-center space-x-4">
                  <div className="bg-orange-100 rounded-full p-2">
                    <Icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {formattedAction}
                      {log.ip_address && ` from IP ${log.ip_address}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getRelativeTime(new Date(log.timestamp))}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      ) : (
        <CardContent>
          <p>No activity found</p>
        </CardContent>
      )}
    </Card>
  );
}
