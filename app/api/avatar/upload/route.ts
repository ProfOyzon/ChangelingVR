import { del, put } from '@vercel/blob';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { logActivity } from '@/lib/auth/actions';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { ActivityType, profiles } from '@/lib/db/schema';

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSession();
  const headersList = await headers();
  const requestedBy = headersList.get('x-requested-by');

  // Invalid session
  if (
    !session ||
    !session.user ||
    typeof session.user.id !== 'string' ||
    new Date(session.expires) < new Date()
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!requestedBy) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get current avatar URL before updating
    const profile = await db
      .select({
        uuid: profiles.uuid,
        avatarUrl: profiles.avatarUrl,
      })
      .from(profiles)
      .where(eq(profiles.username, requestedBy));

    // Check if profile exists
    if (!profile || profile.length === 0) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // UUID mismatch
    if (profile[0].uuid !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete old blob if it exists
    if (profile[0]?.avatarUrl) {
      await del(profile[0].avatarUrl);
    }

    // Upload new blob
    const blob = await put(`avatars/${requestedBy}.webp`, request.body as ReadableStream, {
      access: 'public',
      addRandomSuffix: true,
    });

    // Update user's avatar in the database
    await Promise.all([
      db
        .update(profiles)
        .set({ avatarUrl: blob.url as string })
        .where(eq(profiles.uuid, profile[0].uuid)),
      logActivity(profile[0].uuid, ActivityType.UPDATE_ACCOUNT),
    ]);

    return NextResponse.json(blob);
  } catch {
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
