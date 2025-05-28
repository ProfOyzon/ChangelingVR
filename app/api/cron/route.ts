import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// This route is used to ping Supabase from Vercel
// Supabase free tier requires activity every week
// Currently we trigger this every day at midnight (vercel.json)

export async function GET(request: NextRequest) {
  // Authorize the request using a secret token
  // https://vercel.com/docs/cron-jobs/manage-cron-jobs
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  try {
    // Ping Supabase to check if the connection is working
    // cron table contains 1 row of dummy data
    const { data, error } = await supabase.from('cron').select('*');

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch cron' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to ping Supabase' }, { status: 500 });
  }
}
