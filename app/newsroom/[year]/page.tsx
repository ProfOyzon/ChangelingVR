import { notFound } from 'next/navigation';
import { findPost } from '@/app/newsroom/find-post';
import { getCachedPosts } from '@/lib/cache';
import type { Post } from '@/types';

export default async function Posts({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const { data } = (await getCachedPosts()) as { data: Post[] };

  const posts = findPost({ data, year });
  if (!posts || !Array.isArray(posts)) return notFound();
  console.log(posts);

  // TODO: same as posts/page.tsx, but with the posts filtered by year
  return (
    <div className="max-w-7xl mx-auto p-6 min-h-svh">
      <div className="h-16" aria-hidden="true"></div>
      <h1 className="text-3xl font-bold mb-8">Posts for {year}</h1>
    </div>
  );
}
