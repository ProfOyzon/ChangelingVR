import { NextResponse } from 'next/server';
import { getCachedUser } from '@/lib/cache';

export async function GET() {
  try {
    const { data } = await getCachedUser();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch devs' }, { status: 500 });
  }
}
