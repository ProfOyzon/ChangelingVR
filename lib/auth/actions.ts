'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { createHash, randomUUID } from 'node:crypto';
import { LoginEmail, PasswordResetEmail, WelcomeEmail } from '@/components/email';
import { validatedAction, validatedActionWithUser } from '@/lib/auth/middleware';
import { comparePassword, hashPassword, setSession } from '@/lib/auth/session';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from '@/lib/auth/validator';
import { db } from '@/lib/db';
import { getUserProfile } from '@/lib/db/queries';
import {
  ActivityType,
  type NewActivityLog,
  type NewMember,
  type NewProfile,
  type Profile,
  activityLogs,
  members,
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

export async function logActivity(userId: string, type: ActivityType) {
  const header = await headers();
  const ipAddress = (header.get('x-forwarded-for') ?? '::1').split(',')[0];
  const userAgent = header.get('user-agent') ?? 'unknown';

  if (!userId) return;
  if (ipAddress === '::1') return;

  // Get geolocation data
  let geolocationData: GeoLocationData | null = null;
  try {
    const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
    geolocationData = await response.json();
  } catch {}

  if (type === ActivityType.SIGN_IN && geolocationData) {
    const [member, profile, activity] = await Promise.all([
      db.select({ email: members.email }).from(members).where(eq(members.uuid, userId)),
      db.select({ username: profiles.username }).from(profiles).where(eq(profiles.uuid, userId)),
      db.select().from(activityLogs).where(eq(activityLogs.uuid, userId)).limit(10),
    ]);

    // Check if this is a new location
    const isNewLocation = !activity.some((log) => log.zip === geolocationData.zip);
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

  const newActivity: NewActivityLog = {
    uuid: userId,
    action: type,
    ip_address: ipAddress || '',
    user_agent: userAgent,
    country: geolocationData?.country || null,
    country_code: geolocationData?.countryCode || null,
    region: geolocationData?.regionName || null,
    city: geolocationData?.city || null,
    latitude: geolocationData?.lat?.toString() || null,
    longitude: geolocationData?.lon?.toString() || null,
    zip: geolocationData?.zip || null,
  };

  await db.insert(activityLogs).values(newActivity);
}

export const login = validatedAction(loginSchema, async (data, formData) => {
  const { email, password } = data;

  // Fetch member by email
  const member = await db.select().from(members).where(eq(members.email, email)).limit(1);
  if (!member || member.length === 0) {
    return { error: 'Invalid email or password.', email, password };
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, member[0].password);
  if (!isPasswordValid) {
    return { error: 'Invalid email or password.', email, password };
  }

  await Promise.all([setSession(member[0]), logActivity(member[0].uuid, ActivityType.SIGN_IN)]);

  // Redirect to dashboard
  redirect('/dashboard');
});

export const register = validatedAction(registerSchema, async (data, formData) => {
  const { email, password } = data;

  const member = await db.select().from(members).where(eq(members.email, email)).limit(1);
  if (member.length > 0) {
    return { error: 'Failed to create user.', email, password };
  }

  // Create new member
  const hashedPassword = await hashPassword(password);
  const newMember: NewMember = {
    email,
    password: hashedPassword,
    created_at: new Date(),
  };

  // Create new member in database
  const newMemberData = await db.insert(members).values(newMember).returning();
  if (!newMemberData || newMemberData.length === 0) {
    return { error: 'Failed to create user.', email, password };
  }

  // Create new profile
  const newProfile: NewProfile = {
    uuid: newMemberData[0].uuid,
    username: email.split('@')[0] + '-' + newMemberData[0].uuid.slice(0, 4),
    terms: [new Date().getFullYear()],
  };

  // Create new profile in database
  const newProfileData = await db.insert(profiles).values(newProfile).returning();
  if (!newProfileData || newProfileData.length === 0) {
    return { error: 'Failed to create profile.', email, password };
  }

  await Promise.all([
    setSession(newMemberData[0]),
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

export async function logout() {
  const user = (await getUserProfile()) as Profile;
  await logActivity(user.uuid, ActivityType.SIGN_OUT);
  (await cookies()).delete('session');
}

export const updateProfile = validatedActionWithUser(updateProfileSchema, async (data, _, user) => {
  try {
    await db
      .update(profiles)
      .set({
        username: data.username,
        display_name: data.display_name,
        bio: data.bio,
        terms: data.terms,
        roles: data.roles,
        teams: data.teams,
        avatar_url: data.avatar_url,
        bg_color: data.bg_color,
      })
      .where(eq(profiles.uuid, user.uuid));

    revalidateTag('profiles');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update profile' };
  }
});

export const updatePassword = validatedAction(updatePasswordSchema, async (data, formData) => {
  const { token, password } = data;
  const hashedToken = createHash('sha256').update(token).digest('hex');
  const hashedPassword = await hashPassword(password);

  const storedToken = await db
    .select()
    .from(resetTokens)
    .where(eq(resetTokens.token, hashedToken))
    .limit(1);

  // Ensure token exists and is not expired
  if (storedToken.length === 0 || storedToken[0].expires_at < new Date()) {
    return { error: 'Invalid token or token expired' };
  }

  await Promise.all([
    db
      .update(members)
      .set({ password: hashedPassword })
      .where(eq(members.uuid, storedToken[0].uuid)),
    db.delete(resetTokens).where(eq(resetTokens.uuid, storedToken[0].uuid)),
    logActivity(storedToken[0].uuid, ActivityType.UPDATE_PASSWORD),
  ]);

  redirect('/auth/login');
});

export const forgotPassword = validatedAction(forgotPasswordSchema, async (data, formData) => {
  const { email } = data;

  const member = await db.select().from(members).where(eq(members.email, email)).limit(1);
  if (!member || member.length === 0) {
    // Still show success message to prevent account enumeration
    redirect('/auth/forgot-password?success=true');
  }

  const token = randomUUID();
  const hashedToken = createHash('sha256').update(token).digest('hex');
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password?token=${encodeURIComponent(token)}`;

  const TOKEN_EXPIRY_MS = 1000 * 60 * 30; // 30 minutes

  await db.transaction(async (tx) => {
    const existingToken = await tx
      .select()
      .from(resetTokens)
      .where(eq(resetTokens.uuid, member[0].uuid));

    if (existingToken.length > 0) {
      await tx
        .update(resetTokens)
        .set({
          token: hashedToken,
          expires_at: new Date(Date.now() + TOKEN_EXPIRY_MS),
        })
        .where(eq(resetTokens.uuid, member[0].uuid));
    } else {
      await tx.insert(resetTokens).values({
        uuid: member[0].uuid,
        token: hashedToken,
        expires_at: new Date(Date.now() + TOKEN_EXPIRY_MS),
      });
    }
  });

  await sendMail({
    reciever: email,
    subject: 'Changeling VR Password Reset',
    plainText: `Click the link below to reset your password: ${url}`,
    email: PasswordResetEmail({ username: member[0].email, url }),
  });

  redirect('/auth/forgot-password?success=true');
});
