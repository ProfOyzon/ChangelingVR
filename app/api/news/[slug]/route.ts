import { type NextRequest, NextResponse } from 'next/server';
import { getCachedNews } from '@/lib/cache';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { data } = await getCachedNews();
    const news = data?.find((item) => item.key === slug);

    if (!news) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 });
    }

    return NextResponse.json(news, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news item' }, { status: 500 });
  }
}
