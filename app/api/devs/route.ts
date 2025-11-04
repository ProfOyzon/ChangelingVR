import { NextResponse } from 'next/server';
import { getCachedUsers } from '@/lib/cache';

export async function GET() {
  try {
    const { data, cachedAt } = await getCachedUsers();
    return NextResponse.json({ data, cachedAt }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch devs' }, { status: 500 });
  }
}
