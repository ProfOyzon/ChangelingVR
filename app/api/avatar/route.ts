import { del, put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { logActivity } from '@/lib/actions/log-activity';
import { getAuthenticatedSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { ActivityType, profiles } from '@/lib/db/schema';

export async function POST(request: Request) {
  const auth = await getAuthenticatedSession();
  if (!auth || !auth.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get current avatar URL before updating
    const profile = await db.query.profiles.findFirst({
      where: { uuid: auth.session.user.id },
      columns: { uuid: true, username: true, avatarUrl: true },
    });

    // Check if profile exists
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // UUID mismatch
    if (profile.uuid !== auth.session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete old blob if it exists
    if (profile.avatarUrl) {
      try {
        await del(profile.avatarUrl);
      } catch {}
    }

    // Upload new blob
    const blob = await put(`avatars/${profile.username}.webp`, request.body as ReadableStream, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Update user's avatar in the database
    await Promise.all([
      db.update(profiles).set({ avatarUrl: blob.url }).where(eq(profiles.uuid, profile.uuid)),
      logActivity(profile.uuid, ActivityType.UPDATE_ACCOUNT),
    ]);

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

export async function DELETE() {
  const auth = await getAuthenticatedSession();
  if (!auth || !auth.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get current avatar URL before deleting
    const profile = await db.query.profiles.findFirst({
      where: { uuid: auth.session.user.id },
      columns: { uuid: true, username: true, avatarUrl: true },
    });

    // Check if profile exists
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Delete old blob if it exists
    if (profile.avatarUrl) {
      await del(profile.avatarUrl);
    }

    // Update user's avatar in the database to null
    await Promise.all([
      db.update(profiles).set({ avatarUrl: null }).where(eq(profiles.uuid, profile.uuid)),
      logActivity(profile.uuid, ActivityType.UPDATE_ACCOUNT),
    ]);

    return NextResponse.json({ message: 'Avatar deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete avatar' }, { status: 500 });
  }
}
