import { NextResponse } from 'next/server';
import charactersData from '@/lib/data/characters.json';

export async function GET() {
  try {
    return NextResponse.json(charactersData, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch characters' }, { status: 500 });
  }
}
