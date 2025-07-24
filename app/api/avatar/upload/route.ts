import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { logActivity } from '@/lib/auth/actions';
import { verifyToken } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { ActivityType, profiles } from '@/lib/db/schema';
import { del, put } from '@vercel/blob';

export async function POST(request: Request): Promise<NextResponse> {
  const sessionCookie = (await cookies()).get('session');
  const filename = new URL(request.url).searchParams.get('filename');

  // No session cookie
  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Invalid session cookie
  const sessionData = await verifyToken(sessionCookie.value);
  if (!sessionData || !sessionData.user || typeof sessionData.user.id !== 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Session expired
  if (new Date(sessionData.expires) < new Date()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // No filename
  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  // UUID mismatch
  if (sessionData.user.id !== filename.split('.')[0]) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get current avatar URL before updating
    const uuid = filename.split('.')[0];
    const profile = await db
      .select({
        avatar_url: profiles.avatar_url,
      })
      .from(profiles)
      .where(eq(profiles.uuid, uuid));

    // Check if profile exists
    if (!profile || profile.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Delete old blob if it exists
    if (profile[0]?.avatar_url) {
      await del(profile[0].avatar_url);
    }

    // Upload new blob
    const blob = await put(`avatars/${filename}`, request.body as ReadableStream, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Update user's avatar in the database
    await Promise.all([
      db.update(profiles).set({ avatar_url: blob.url }).where(eq(profiles.uuid, uuid)),
      logActivity(uuid, ActivityType.UPDATE_ACCOUNT),
    ]);

    return NextResponse.json(blob);
  } catch {
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
