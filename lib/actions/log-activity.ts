'use server';

import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { sendMail } from '@/emails/transport';
import UnknownLoginEmail from '@/emails/unknown-login';
import { db } from '@/lib/db';
import { ActivityType, activityLogs, members, profiles } from '@/lib/db/schema';

type GeoLocationData = {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  query: string;
};

/**
 * Logs an activity to the database
 * @param userId - The user's ID
 * @param type - The type of activity
 */
export async function logActivity(userId: string, type: ActivityType) {
  const header = await headers();

  // Get IP address and user agent; set to default if not found
  const ipAddress = (header.get('x-forwarded-for') ?? '::1').split(',')[0];
  const userAgent = header.get('user-agent') ?? 'unknown';

  // If no user ID or IP address is localhost, return
  if (!userId || ipAddress === '::1') return;

  // Get geolocation data
  let geolocationData: GeoLocationData | null = null;
  try {
    const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
    geolocationData = await response.json();
  } catch {
    // Do nothing
  }

  // Sign in activity with geolocation data
  if (type === ActivityType.SIGN_IN && geolocationData) {
    // Fetch email, username, and most recent 10 activity logs
    const [member, profile, activity] = await Promise.all([
      db.select({ email: members.email }).from(members).where(eq(members.uuid, userId)),
      db.select({ username: profiles.username }).from(profiles).where(eq(profiles.uuid, userId)),
      db
        .select({ zip: activityLogs.zip })
        .from(activityLogs)
        .where(eq(activityLogs.uuid, userId))
        .limit(10),
    ]);

    // Check if this is a new location by comparing the most recent 10 activity logs with the current geolocation data
    const isNewLocation = !activity.some((log) => log.zip === geolocationData.zip);
    // This is a new location, send email
    if (isNewLocation) {
      await sendMail({
        to: member[0].email,
        subject: 'New sign-in detected on your ChangelingVR account',
        plainText: `A new login was detected from ${geolocationData.city}, ${geolocationData.regionName}, ${geolocationData.country}`,
        html: UnknownLoginEmail({
          name: profile[0].username,
          data: geolocationData,
        }),
      });
    }
  }

  if (type === ActivityType.UPDATE_ACCOUNT) {
    // Get most recent UPDATE_ACCOUNT activity
    const recentActivity = await db.query.activityLogs.findFirst({
      where: { uuid: userId, action: ActivityType.UPDATE_ACCOUNT },
      columns: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    // If the activity is within the last 10 minutes, do not log a new activity
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1_000);
    if (recentActivity && recentActivity.createdAt > tenMinutesAgo) {
      return;
    }
  }

  // Create new activity log
  const newActivity = {
    uuid: userId,
    action: type,
    ipAddress: ipAddress,
    userAgent: userAgent,
    country: geolocationData?.country,
    countryCode: geolocationData?.countryCode,
    region: geolocationData?.regionName,
    city: geolocationData?.city,
    latitude: geolocationData?.lat?.toString(),
    longitude: geolocationData?.lon?.toString(),
    zip: geolocationData?.zip,
  };

  // Insert new activity log into database
  await db.insert(activityLogs).values(newActivity);
}
