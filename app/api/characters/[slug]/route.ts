import { type NextRequest, NextResponse } from 'next/server';
import { getCachedCharacters } from '@/lib/cache';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { data } = await getCachedCharacters();
    const character = data?.find((char) => char.id === slug);

    if (!character) {
      return NextResponse.json({ error: 'Character not found' }, { status: 404 });
    }

    return NextResponse.json(character, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch character' }, { status: 500 });
  }
}
