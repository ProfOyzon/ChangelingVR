import { NextResponse } from 'next/server';
import { getCachedCharacters } from '@/lib/cache';

export async function GET() {
  try {
    const { data } = await getCachedCharacters();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 });
  }
}
