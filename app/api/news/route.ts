import { NextResponse } from 'next/server';
import { getCachedPosts } from '@/lib/cache';

export async function GET() {
  try {
    const data = await getCachedPosts();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
