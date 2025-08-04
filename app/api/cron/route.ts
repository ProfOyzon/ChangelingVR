import { type NextRequest, NextResponse } from 'next/server';
import { eq, lt } from 'drizzle-orm';
import { db } from '@/lib/db';
import { resetTokens } from '@/lib/db/schema';

// This route is used to clean up any expired data in the database
// Currently we trigger this every day at midnight (vercel.json)

export async function GET(request: NextRequest) {
  // Authorize the request using a secret token
  // https://vercel.com/docs/cron-jobs/manage-cron-jobs
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // DEPENDING ON SIZE OF `activity_logs` TABLE, WE MAY NEED TO CLEAN UP OLD DATA
  // FOR NOW WE'RE ONLY CLEANING UP `reset_tokens` TABLE
  try {
    // Get all expired reset tokens
    const expiredResetTokens = await db
      .select({ token: resetTokens.token })
      .from(resetTokens)
      .where(lt(resetTokens.expires_at, new Date()));

    if (expiredResetTokens.length > 0) {
      expiredResetTokens.forEach(async (token) => {
        // Delete all expired reset tokens
        await db.delete(resetTokens).where(eq(resetTokens.token, token.token));
      });
    }

    return NextResponse.json({ success: 'Cron job completed' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to clean up expired data' }, { status: 500 });
  }
}
