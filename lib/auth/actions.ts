'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, desc, eq } from 'drizzle-orm';
import { createHash, randomUUID } from 'node:crypto';
import { LoginEmail, PasswordResetEmail, WelcomeEmail } from '@/components/email';
import { validatedAction, validatedActionWithUser } from '@/lib/auth/middleware';
import { comparePassword, hashPassword, setSession } from '@/lib/auth/session';
import {
  zForgotPasswordSchema,
  zLoginSchema,
  zPlatformSchema,
  zProfileLinkSchema,
  zRegisterSchema,
  zUpdatePasswordSchema,
  zUpdateProfileSchema,
} from '@/lib/auth/validator';
import { db } from '@/lib/db';
import { getProfile } from '@/lib/db/queries';
import {
  ActivityType,
  type NewActivityLog,
  type NewMember,
  type NewProfile,
  NewProfileLink,
  type Profile,
  activityLogs,
  members,
  profileLinks,
  profiles,
  resetTokens,
} from '@/lib/db/schema';
import { sendMail } from '@/lib/nodemailer';

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
 * @returns void
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
        reciever: member[0].email,
        subject: 'New sign-in detected on your Changeling VR account',
        plainText: `A new login was detected from ${geolocationData.city}, ${geolocationData.regionName}, ${geolocationData.country}`,
        email: LoginEmail({
          name: profile[0].username,
          data: geolocationData,
        }),
      });
    }
  }

  if (type === ActivityType.UPDATE_ACCOUNT) {
    // Get most recent UPDATE_ACCOUNT activity
    const recentActivity = await db
      .select({ id: activityLogs.id, timestamp: activityLogs.timestamp })
      .from(activityLogs)
      .where(
        and(eq(activityLogs.uuid, userId), eq(activityLogs.action, ActivityType.UPDATE_ACCOUNT)),
      )
      .orderBy(desc(activityLogs.timestamp))
      .limit(1);

    // If the activity is within the last 10 minutes, do not log a new activity
    if (
      recentActivity.length > 0 &&
      new Date(recentActivity[0].timestamp) > new Date(Date.now() - 1000 * 60 * 10)
    ) {
      return;
    }
  }

  // Create new activity log
  const newActivity: NewActivityLog = {
    uuid: userId,
    action: type,
    ipAddress: ipAddress || '',
    userAgent: userAgent,
    country: geolocationData?.country || null,
    countryCode: geolocationData?.countryCode || null,
    region: geolocationData?.regionName || null,
    city: geolocationData?.city || null,
    latitude: geolocationData?.lat?.toString() || null,
    longitude: geolocationData?.lon?.toString() || null,
    zip: geolocationData?.zip || null,
  };

  // Insert new activity log into database
  await db.insert(activityLogs).values(newActivity);
}

/**
 * Validates the login form data and logs the user in
 */
export const login = validatedAction(zLoginSchema, async (data) => {
  const { email, password } = data;

  // Fetch member by email
  const member = await db
    .select({ uuid: members.uuid, password: members.password })
    .from(members)
    .where(eq(members.email, email))
    .limit(1);

  // Member not found, redirect back with error
  if (!member || member.length === 0) {
    return { error: 'Invalid email or password.', email, password };
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, member[0].password);
  if (!isPasswordValid) {
    return { error: 'Invalid email or password.', email, password };
  }

  // Set session and log activity
  await Promise.all([
    setSession(member[0].uuid),
    logActivity(member[0].uuid, ActivityType.SIGN_IN),
  ]);

  // Redirect to dashboard
  redirect('/dashboard');
});

/**
 * Validates the register form data and creates a new user
 */
export const register = validatedAction(zRegisterSchema, async (data) => {
  const { email, password } = data;

  // Check if member already exists
  const member = await db
    .select({ uuid: members.uuid })
    .from(members)
    .where(eq(members.email, email))
    .limit(1);

  // Member already exists, redirect back with error
  if (member.length > 0) {
    return { error: 'Failed to create user' };
  }

  // Create new member
  const hashedPassword = await hashPassword(password);
  const newMember: NewMember = {
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString() as string,
  };

  // Create new member in database
  const newMemberData = await db
    .insert(members)
    .values(newMember)
    .returning({ uuid: members.uuid });
  if (!newMemberData || newMemberData.length === 0) {
    return { error: 'Failed to create user' };
  }

  // Create new profile
  const newProfile: NewProfile = {
    uuid: newMemberData[0].uuid,
    username: email.split('@')[0] + '-' + newMemberData[0].uuid.slice(0, 4),
    terms: [new Date().getFullYear()],
  };

  // Insert new profile into database
  const newProfileData = await db
    .insert(profiles)
    .values(newProfile)
    .returning({ username: profiles.username });
  if (!newProfileData || newProfileData.length === 0) {
    return { error: 'Failed to create profile' };
  }

  // Set session, log activity, and send welcome email
  await Promise.all([
    setSession(newMemberData[0].uuid),
    logActivity(newMemberData[0].uuid, ActivityType.SIGN_UP),
    sendMail({
      reciever: email,
      subject: 'Welcome to Changeling VR',
      plainText: "Welcome to Changeling VR! We're excited to have you on board.",
      email: WelcomeEmail({ name: newProfileData[0].username }),
    }),
  ]);

  // Redirect to dashboard
  redirect('/dashboard');
});

/**
 * Logs the user out and redirects to the home page
 */
export async function logout() {
  const user = (await getProfile()) as Profile;
  await logActivity(user.uuid, ActivityType.SIGN_OUT);
  (await cookies()).delete('session');
  redirect('/auth/login');
}

/**
 * Validates the update profile form data and updates the user's profile
 */
export const updateProfile = validatedActionWithUser(
  zUpdateProfileSchema,
  async (data, session) => {
    try {
      const updateData: Partial<typeof profiles.$inferInsert> = {
        username: data.username,
        displayName: data.displayName,
        bio: data.bio,
        terms: data.terms as number[] | null | undefined,
        roles: data.roles as string[] | null | undefined,
        teams: data.teams as string[] | null | undefined,
        avatarUrl: data.avatarUrl,
        bgColor: data.bgColor,
      };

      const [profile] = await Promise.all([
        db
          .update(profiles)
          .set(updateData)
          .where(eq(profiles.uuid, session.user.id))
          .returning({ username: profiles.username }),
        logActivity(session.user.id, ActivityType.UPDATE_ACCOUNT),
      ]);

      revalidateTag(`profile:${profile[0].username}`, 'max');
      revalidatePath('/dashboard/profile');
      revalidatePath('/dashboard/settings');
    } catch (error: any) {
      // Check if it's a PostgreSQL unique constraint violation for the username
      if (
        error?.cause?.code === '23505' &&
        error?.cause?.constraint_name === 'profiles_username_key'
      ) {
        return { error: `The username '${data.username}' is already taken` };
      }

      // It failed, return the error
      return { error: 'Failed to update profile' };
    }
  },
);

export const updateProfileLink = validatedActionWithUser(
  zProfileLinkSchema,
  async (data, session) => {
    try {
      const [profile] = await Promise.all([
        db
          .select({ username: profiles.username })
          .from(profiles)
          .where(eq(profiles.uuid, session.user.id)),
        db
          .insert(profileLinks)
          .values({
            uuid: session.user.id,
            platform: data.platform,
            url: data.url,
            visible: data.visible,
          })
          .onConflictDoUpdate({
            target: [profileLinks.uuid, profileLinks.platform],
            set: {
              url: data.url,
              visible: data.visible,
            },
          }),
        logActivity(session.user.id, ActivityType.UPDATE_ACCOUNT),
      ]);

      revalidateTag(`profile:${profile[0].username}`, 'max');
      revalidatePath('/dashboard/connections');
    } catch {
      throw new Error('Failed to update profile link');
    }
  },
);

export const addProfileLink = validatedActionWithUser(zProfileLinkSchema, async (data, session) => {
  try {
    const newProfileLink: NewProfileLink = {
      uuid: session.user.id,
      platform: data.platform,
      url: data.url,
      visible: data.visible,
    };

    const [profile] = await Promise.all([
      db
        .select({ username: profiles.username })
        .from(profiles)
        .where(eq(profiles.uuid, session.user.id)),
      db.insert(profileLinks).values(newProfileLink),
    ]);

    revalidateTag(`profile:${profile[0].username}`, 'max');
    revalidatePath('/dashboard/connections');
  } catch {
    throw new Error('Failed to add profile link');
  }
});

export const deleteProfileLink = validatedActionWithUser(zPlatformSchema, async (data, session) => {
  try {
    const [profile] = await Promise.all([
      db
        .select({ username: profiles.username })
        .from(profiles)
        .where(eq(profiles.uuid, session.user.id)),
      db
        .delete(profileLinks)
        .where(
          and(eq(profileLinks.uuid, session.user.id), eq(profileLinks.platform, data.platform)),
        ),
      logActivity(session.user.id, ActivityType.UPDATE_ACCOUNT),
    ]);

    revalidateTag(`profile:${profile[0].username}`, 'max');
    revalidatePath('/dashboard/connections');
  } catch {
    // It failed, client will handle the error
  }
});

/**
 * Validates the update password form data and updates the user's password
 */
export const updatePassword = validatedAction(zUpdatePasswordSchema, async (data) => {
  const { token, password } = data;

  // Hash the token and password
  const hashedToken = createHash('sha256').update(token).digest('hex');
  const hashedPassword = await hashPassword(password);

  // Fetch stored token
  const storedToken = await db
    .select({ uuid: resetTokens.uuid, expiresAt: resetTokens.expiresAt })
    .from(resetTokens)
    .where(eq(resetTokens.token, hashedToken))
    .limit(1);

  // Ensure token exists and is not expired
  if (storedToken.length === 0 || new Date(storedToken[0].expiresAt) < new Date()) {
    return { error: 'Invalid token or token expired' };
  }

  // Update password and delete token
  await Promise.all([
    db
      .update(members)
      .set({ password: hashedPassword })
      .where(eq(members.uuid, storedToken[0].uuid)),
    db.delete(resetTokens).where(eq(resetTokens.uuid, storedToken[0].uuid)),
    logActivity(storedToken[0].uuid, ActivityType.UPDATE_PASSWORD),
  ]);

  // Redirect to login page
  redirect('/auth/login');
});

/**
 * Validates the forgot password form data and sends a password reset email
 */
export const forgotPassword = validatedAction(zForgotPasswordSchema, async (data) => {
  const { email } = data;

  const member = await db
    .select({ uuid: members.uuid, email: members.email })
    .from(members)
    .where(eq(members.email, email))
    .limit(1);

  if (!member || member.length === 0) {
    // Still show success message to prevent account enumeration
    redirect('/auth/forgot-password?success=true');
  }

  const token = randomUUID();
  const hashedToken = createHash('sha256').update(token).digest('hex');
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password?token=${encodeURIComponent(token)}`;

  const TOKEN_EXPIRY_MS = 1000 * 60 * 30; // 30 minutes

  await db
    .insert(resetTokens)
    .values({
      uuid: member[0].uuid,
      token: hashedToken,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString() as string,
    })
    // Update previous token if it exists
    .onConflictDoUpdate({
      target: resetTokens.uuid,
      set: {
        token: hashedToken,
        expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString() as string,
      },
    });

  await sendMail({
    reciever: email,
    subject: 'Changeling VR Password Reset',
    plainText: `Click the link below to reset your password: ${url}`,
    email: PasswordResetEmail({ username: member[0].email, url }),
  });

  redirect('/auth/forgot-password?success=true');
});
