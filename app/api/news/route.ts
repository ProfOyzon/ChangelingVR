import { NextResponse } from 'next/server';
import { getCachedNews } from '@/lib/cache';

export async function GET() {
  try {
    const data = await getCachedNews();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
